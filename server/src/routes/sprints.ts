import { Router, Request, Response } from 'express';
import { sprints } from '../db/store.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate);

// GET /api/sprints
router.get('/', (_req: Request, res: Response) => {
  res.json({ sprints });
});

// GET /api/sprints/:id
router.get('/:id', (req: Request, res: Response) => {
  const sprint = sprints.find((s) => s.id === req.params.id);
  if (!sprint) { res.status(404).json({ message: 'Sprint not found' }); return; }
  res.json(sprint);
});

export { router as sprintsRouter };
