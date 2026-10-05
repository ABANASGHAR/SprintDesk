import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import { users, refreshTokens } from '../db/store.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sprintdesk-secret-key-dev';
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '60m';
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  expiresInMins: z.number().optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
  expiresInMins: z.number().optional(),
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };
  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  const accessToken = jwt.sign(safeUser, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES } as object);
  const refreshToken = crypto.randomBytes(64).toString('hex');
  refreshTokens.set(refreshToken, user.id);
  setTimeout(() => refreshTokens.delete(refreshToken), REFRESH_TOKEN_EXPIRES_MS);
  res.json({
    accessToken,
    refreshToken,
    token: accessToken, // compat alias
    ...safeUser,
  });
});

// POST /api/auth/refresh
router.post('/refresh', validate(refreshSchema), (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  const userId = refreshTokens.get(refreshToken);
  if (!userId) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
    return;
  }
  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  const newAccessToken = jwt.sign(safeUser, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES } as object);
  const newRefreshToken = crypto.randomBytes(64).toString('hex');
  refreshTokens.delete(refreshToken);
  refreshTokens.set(newRefreshToken, userId);
  setTimeout(() => refreshTokens.delete(newRefreshToken), REFRESH_TOKEN_EXPIRES_MS);
  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken, token: newAccessToken });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) refreshTokens.delete(refreshToken);
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', authenticate, (req: Request, res: Response) => {
  res.json(req.user);
});

export { router as authRouter };
