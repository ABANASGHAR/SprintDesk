import { Router, Request, Response } from 'express';
import { notifications } from '../db/store.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate);

// GET /api/notifications
router.get('/', (_req: Request, res: Response) => {
  res.json({ notifications, total: notifications.length });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req: Request, res: Response) => {
  const notif = notifications.find((n) => n.id === req.params.id);
  if (!notif) { res.status(404).json({ message: 'Notification not found' }); return; }
  notif.read = true;
  res.json(notif);
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', (_req: Request, res: Response) => {
  notifications.forEach((n) => { n.read = true; });
  res.json({ message: 'All marked as read' });
});

export { router as notificationsRouter };
