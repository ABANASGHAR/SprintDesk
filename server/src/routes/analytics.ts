import { Router, Request, Response } from 'express';
import { tasks, sprints } from '../db/store.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate);

// GET /api/analytics/summary
router.get('/summary', (_req: Request, res: Response) => {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done',
  ).length;
  const activeSprint = sprints.find((s) => s.status === 'active');
  res.json({ total, done, inProgress, overdue, activeSprint: activeSprint ?? null });
});

// GET /api/analytics/velocity
router.get('/velocity', (_req: Request, res: Response) => {
  const data = sprints.map((s) => {
    const sprintTasks = tasks.filter((t) => t.sprintId === s.id);
    const completed = sprintTasks
      .filter((t) => t.status === 'done')
      .reduce((sum, t) => sum + t.storyPoints, 0);
    const planned = sprintTasks.reduce((sum, t) => sum + t.storyPoints, 0);
    return { sprint: s.name, completed, planned, velocity: s.velocity };
  });
  res.json(data);
});

// GET /api/analytics/status-breakdown
router.get('/status-breakdown', (_req: Request, res: Response) => {
  const statuses = ['backlog', 'todo', 'in-progress', 'in-review', 'done'] as const;
  const data = statuses.map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
  }));
  res.json(data);
});

export { router as analyticsRouter };
