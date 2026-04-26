import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload } from './auth-service.js';
import { AuthService } from './auth-service.js';

export type UserRole = 'admin' | 'owner' | 'manager' | 'staff' | 'viewer';

export interface AuthenticatedUser extends JWTPayload {
  role: UserRole;
  orgId?: string;
}

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,
  staff: 2,
  manager: 3,
  owner: 4,
  admin: 5,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === 'admin';
}

export function isOwner(user: AuthenticatedUser): boolean {
  return user.role === 'owner';
}

export function canManageOrg(user: AuthenticatedUser): boolean {
  return hasRole(user.role, 'owner') || isAdmin(user);
}

export function canManageUsers(user: AuthenticatedUser): boolean {
  return hasRole(user.role, 'manager') || isAdmin(user);
}

export function canViewAllOrgs(user: AuthenticatedUser): boolean {
  return isAdmin(user);
}

// Middleware functions
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  const authService = (request.server as any).authService as AuthService;

  const payload = authService.verifyAccessToken(token);
  if (!payload) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }

  // Attach user to request
  (request as any).user = payload;
}

export function requireRole(requiredRole: UserRole) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user as AuthenticatedUser;

    if (!user) {
      return reply.code(401).send({ error: 'Authentication required' });
    }

    if (!hasRole(user.role, requiredRole)) {
      return reply.code(403).send({ error: 'Insufficient permissions' });
    }
  };
}

export function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  return requireRole('admin')(request, reply);
}

export function requireOwner(request: FastifyRequest, reply: FastifyReply) {
  return requireRole('owner')(request, reply);
}

export function requireOrgAccess(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user as AuthenticatedUser;

  if (!user) {
    return reply.code(401).send({ error: 'Authentication required' });
  }

  // Admin can access any org
  if (isAdmin(user)) {
    return;
  }

  // Users must belong to an org
  if (!user.orgId) {
    return reply.code(403).send({ error: 'Organization access required' });
  }
}