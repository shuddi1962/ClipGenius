import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { insforgeClient } from '../database/insforge.js';
import {
  AuthService,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth-service.js';
import { requireAuth, requireAdmin, requireOrgAccess } from './rbac.js';

export async function authRoutes(server: FastifyInstance, authService: AuthService) {
  // Register new user
  server.post('/auth/register', {
    schema: {
      body: registerSchema,
    },
  }, async (request, reply) => {
    const { email, password, name, orgName } = request.body as z.infer<typeof registerSchema>;

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
  });

  // Verify email
  server.post('/auth/verify-email', {
    schema: {
      body: verifyEmailSchema,
    },
  }, async (request, reply) => {
    const { token } = request.body as z.infer<typeof verifyEmailSchema>;

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
  });

  // Login
  server.post('/auth/login', {
    schema: {
      body: loginSchema,
    },
  }, async (request, reply) => {
    const { email, password } = request.body as z.infer<typeof loginSchema>;

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
  });

  // Refresh token
  server.post('/auth/refresh', {
    schema: {
      body: refreshTokenSchema,
    },
  }, async (request, reply) => {
    const { refreshToken } = request.body as z.infer<typeof refreshTokenSchema>;

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
  });

  // Logout
  server.post('/auth/logout', { preHandler: requireAuth }, async (request, reply) => {
    const user = (request as any).user;

    // Remove all sessions for user
    await insforgeClient.deleteOne('sessions', { user_id: user.userId });

    return reply.send({ message: 'Logged out successfully' });
  });

  // Get current user
  server.get('/auth/me', { preHandler: requireAuth }, async (request, reply) => {
    const user = (request as any).user;

    const fullUser = await insforgeClient.findOne('users', { id: user.userId });
    if (!fullUser) {
      return reply.code(404).send({ error: 'User not found' });
    }

    const member = await insforgeClient.findOne('org_members', { user_id: user.userId });
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
  });

  // Reset password request
  server.post('/auth/reset-password', {
    schema: {
      body: resetPasswordSchema,
    },
  }, async (request, reply) => {
    const { email } = request.body as z.infer<typeof resetPasswordSchema>;

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
  });

  // Change password
  server.post('/auth/change-password', {
    schema: {
      body: changePasswordSchema,
    },
  }, async (request, reply) => {
    const { token, newPassword } = request.body as z.infer<typeof changePasswordSchema>;

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
  });
}