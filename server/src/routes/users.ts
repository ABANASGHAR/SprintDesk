import { Router, Request, Response } from 'express';
import { users } from '../db/store.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate);

// GET /api/users
router.get('/', (_req: Request, res: Response) => {
  const safe = users.map(({ passwordHash: _, ...u }) => u);
  res.json({ users: safe });
});

export { router as usersRouter };
