import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { insforgeClient } from '../database/insforge.js';
import { AuthService } from '../auth/auth-service.js';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  orgName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const verifyEmailSchema = z.object({
  token: z.string(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const changePasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export async function authRoutes(server: FastifyInstance, authService: AuthService) {
  // Register new user
  server.post('/api/auth/register', {
    schema: {
      body: registerSchema,
    },
  }, async (request, reply) => {
    const { email, password, name, orgName } = request.body as z.infer<typeof registerSchema>;

    try {
      // Check if user already exists
      const existingUser = await insforgeClient.findOne('users', { email });
      if (existingUser) {
        return reply.code(409).send({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await authService.hashPassword(password);

      // Generate verification token
      const verificationToken = authService.generateSecureToken();

      // Create user
      const userId = authService.generateSecureToken(16);
      const user = {
        id: userId,
        email,
        password_hash: passwordHash,
        name,
        role: 'owner', // First user is owner
        email_verified: false,
        verification_token: verificationToken,
        created_at: new Date(),
      };

      await insforgeClient.insertOne('users', user);

      // Create organization if orgName provided
      let orgId: string | undefined;
      if (orgName) {
        orgId = authService.generateSecureToken(16);
        const org = {
          id: orgId,
          name: orgName,
          owner_id: userId,
          created_at: new Date(),
        };
        await insforgeClient.insertOne('organizations', org);

        // Add user to organization
        const member = {
          id: authService.generateSecureToken(16),
          org_id: orgId,
          user_id: userId,
          role: 'owner',
          joined_at: new Date(),
        };
        await insforgeClient.insertOne('org_members', member);
      }

      // TODO: Send verification email

      return reply.code(201).send({
        message: 'User registered successfully. Please check your email for verification.',
        userId,
        orgId,
      });
    } catch (error) {
      console.error('Registration error:', error);
      return reply.code(500).send({ error: 'Registration failed' });
    }
  });

  // Verify email
  server.post('/api/auth/verify-email', {
    schema: {
      body: verifyEmailSchema,
    },
  }, async (request, reply) => {
    const { token } = request.body as z.infer<typeof verifyEmailSchema>;

    try {
      // Find user with verification token
      const user = await insforgeClient.findOne('users', { verification_token: token });
      if (!user) {
        return reply.code(400).send({ error: 'Invalid verification token' });
      }

      // Update user as verified
      await insforgeClient.updateOne(
        'users',
        { id: user.id },
        {
          email_verified: true,
          verification_token: null,
          updated_at: new Date(),
        }
      );

      return reply.send({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Email verification error:', error);
      return reply.code(500).send({ error: 'Email verification failed' });
    }
  });

  // Login
  server.post('/api/auth/login', {
    schema: {
      body: loginSchema,
    },
  }, async (request, reply) => {
    const { email, password } = request.body as z.infer<typeof loginSchema>;

    try {
      // Find user
      const user = await insforgeClient.findOne('users', { email });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await authService.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!user.email_verified) {
        return reply.code(403).send({ error: 'Please verify your email first' });
      }

      // Get user's organization
      const member = await insforgeClient.findOne('org_members', { user_id: user.id });
      const orgId = member?.org_id;

      // Generate tokens
      const accessToken = authService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        orgId,
      });

      const refreshTokenId = authService.generateSecureToken(16);
      const refreshToken = authService.generateRefreshToken({
        userId: user.id,
        tokenId: refreshTokenId,
      });

      // Store refresh token
      const session = {
        id: refreshTokenId,
        user_id: user.id,
        token_hash: await authService.hashPassword(refreshToken),
        ip: request.ip,
        user_agent: request.headers['user-agent'] || '',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };

      await insforgeClient.insertOne('sessions', session);

      // Update last login
      await insforgeClient.updateOne(
        'users',
        { id: user.id },
        { last_login_at: new Date() }
      );

      return reply.send({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          orgId,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return reply.code(500).send({ error: 'Login failed' });
    }
  });

  // Refresh token
  server.post('/api/auth/refresh', {
    schema: {
      body: refreshTokenSchema,
    },
  }, async (request, reply) => {
    const { refreshToken } = request.body as z.infer<typeof refreshTokenSchema>;

    try {
      // Verify refresh token
      const payload = authService.verifyRefreshToken(refreshToken);
      if (!payload) {
        return reply.code(401).send({ error: 'Invalid refresh token' });
      }

      // Find session
      const session = await insforgeClient.findOne('sessions', { id: payload.tokenId });
      if (!session) {
        return reply.code(401).send({ error: 'Session not found' });
      }

      // Verify token hash
      const isValidToken = await authService.verifyPassword(refreshToken, session.token_hash);
      if (!isValidToken) {
        return reply.code(401).send({ error: 'Invalid refresh token' });
      }

      // Check if session expired
      if (new Date() > new Date(session.expires_at)) {
        return reply.code(401).send({ error: 'Refresh token expired' });
      }

      // Get user
      const user = await insforgeClient.findOne('users', { id: payload.userId });
      if (!user) {
        return reply.code(401).send({ error: 'User not found' });
      }

      // Get user's organization
      const member = await insforgeClient.findOne('org_members', { user_id: user.id });
      const orgId = member?.org_id;

      // Generate new access token
      const accessToken = authService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        orgId,
      });

      return reply.send({ accessToken });
    } catch (error) {
      console.error('Token refresh error:', error);
      return reply.code(500).send({ error: 'Token refresh failed' });
    }
  });

  // Logout
  server.post('/api/auth/logout', async (request, reply) => {
    try {
      // Get token from header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Missing authorization token' });
      }

      const token = authHeader.substring(7);
      const payload = authService.verifyAccessToken(token);

      if (payload) {
        // Remove all sessions for user
        await insforgeClient.deleteOne('sessions', { user_id: payload.userId });
      }

      return reply.send({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return reply.code(500).send({ error: 'Logout failed' });
    }
  });

  // Get current user
  server.get('/api/auth/me', async (request, reply) => {
    try {
      // Get token from header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Missing authorization token' });
      }

      const token = authHeader.substring(7);
      const payload = authService.verifyAccessToken(token);

      if (!payload) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const fullUser = await insforgeClient.findOne('users', { id: payload.userId });
      if (!fullUser) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const member = await insforgeClient.findOne('org_members', { user_id: payload.userId });
      const org = member ? await insforgeClient.findOne('organizations', { id: member.org_id }) : null;

      return reply.send({
        user: {
          id: fullUser.id,
          email: fullUser.email,
          name: fullUser.name,
          role: fullUser.role,
          avatar: fullUser.avatar,
          email_verified: fullUser.email_verified,
          last_login_at: fullUser.last_login_at,
        },
        organization: org ? {
          id: org.id,
          name: org.name,
          logo: org.logo,
          domain: org.domain,
        } : null,
      });
    } catch (error) {
      console.error('Get user error:', error);
      return reply.code(500).send({ error: 'Failed to get user data' });
    }
  });

  // Reset password request
  server.post('/api/auth/reset-password', {
    schema: {
      body: resetPasswordSchema,
    },
  }, async (request, reply) => {
    const { email } = request.body as z.infer<typeof resetPasswordSchema>;

    try {
      const user = await insforgeClient.findOne('users', { email });
      if (user) {
        const resetToken = authService.generateSecureToken();
        await insforgeClient.updateOne(
          'users',
          { id: user.id },
          {
            reset_token: resetToken,
            reset_token_expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
          }
        );
        // TODO: Send reset email
      }

      return reply.send({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
      console.error('Reset password error:', error);
      return reply.code(500).send({ error: 'Reset password failed' });
    }
  });

  // Change password
  server.post('/api/auth/change-password', {
    schema: {
      body: changePasswordSchema,
    },
  }, async (request, reply) => {
    const { token, newPassword } = request.body as z.infer<typeof changePasswordSchema>;

    try {
      const user = await insforgeClient.findOne('users', {
        reset_token: token,
        reset_token_expires: { $gt: new Date() },
      });

      if (!user) {
        return reply.code(400).send({ error: 'Invalid or expired reset token' });
      }

      const passwordHash = await authService.hashPassword(newPassword);

      await insforgeClient.updateOne(
        'users',
        { id: user.id },
        {
          password_hash: passwordHash,
          reset_token: null,
          reset_token_expires: null,
        }
      );

      return reply.send({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      return reply.code(500).send({ error: 'Change password failed' });
    }
  });
}