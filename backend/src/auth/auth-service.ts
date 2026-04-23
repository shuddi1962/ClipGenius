import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  orgId?: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

export class AuthService {
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshExpiresIn: string;

  constructor(
    jwtSecret: string,
    jwtRefreshSecret: string,
    jwtExpiresIn: string,
    jwtRefreshExpiresIn: string
  ) {
    this.jwtSecret = jwtSecret;
    this.jwtRefreshSecret = jwtRefreshSecret;
    this.jwtExpiresIn = jwtExpiresIn;
    this.jwtRefreshExpiresIn = jwtRefreshExpiresIn;
  }

  // Password hashing
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // JWT tokens
  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: this.jwtRefreshExpiresIn });
  }

  verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(token, this.jwtRefreshSecret) as RefreshTokenPayload;
    } catch {
      return null;
    }
  }

  // Generate secure tokens
  generateSecureToken(length: number = 32): string {
    return require('crypto').randomBytes(length).toString('hex');
  }
}

// Validation schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  orgName: z.string().min(2).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const changePasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});