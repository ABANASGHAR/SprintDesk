import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { tasks } from '../db/store.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import type { Task, Comment, TaskStatus } from '../types/index.js';
import crypto from 'crypto';

const router = Router();

// All task routes require auth
router.use(authenticate);

const taskCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().default(''),
  status: z.enum(['backlog', 'todo', 'in-progress', 'in-review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  type: z.enum(['feature', 'bug', 'chore', 'story']).default('feature'),
  storyPoints: z.number().min(0).max(100).default(1),
  assignee: z.string().default('Unassigned'),
  assigneeAvatar: z.string().optional(),
  sprintId: z.string().default('s4'),
  tags: z.array(z.string()).default([]),
  dueDate: z.string().optional(),
});

const taskUpdateSchema = taskCreateSchema.partial();

const commentSchema = z.object({
  text: z.string().min(1),
});

// GET /api/tasks
router.get('/', (req: Request, res: Response) => {
  const { status, sprintId, assignee } = req.query;
  let result = [...tasks];
  if (status) result = result.filter((t) => t.status === status);
  if (sprintId) result = result.filter((t) => t.sprintId === sprintId);
  if (assignee) result = result.filter((t) => t.assignee === assignee);
  res.json({ tasks: result, total: result.length });
});

// GET /api/tasks/:id
router.get('/:id', (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) { res.status(404).json({ message: 'Task not found' }); return; }
  res.json(task);
});

// POST /api/tasks
router.post('/', validate(taskCreateSchema), (req: Request, res: Response) => {
  const now = new Date().toISOString();
  const newTask: Task = {
    id: `task-${crypto.randomUUID()}`,
    comments: [],
    createdAt: now,
    updatedAt: now,
    ...req.body as Partial<Task>,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id
router.patch('/:id', validate(taskUpdateSchema), (req: Request, res: Response) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) { res.status(404).json({ message: 'Task not found' }); return; }
  tasks[idx] = { ...tasks[idx], ...req.body as Partial<Task>, updatedAt: new Date().toISOString() };
  res.json(tasks[idx]);
});

// PATCH /api/tasks/:id/move
router.patch('/:id/move', (req: Request, res: Response) => {
  const { status } = req.body as { status: TaskStatus };
  const validStatuses: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'in-review', 'done'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: 'Invalid status' }); return;
  }
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) { res.status(404).json({ message: 'Task not found' }); return; }
  tasks[idx] = { ...tasks[idx], status, updatedAt: new Date().toISOString() };
  res.json(tasks[idx]);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) { res.status(404).json({ message: 'Task not found' }); return; }
  tasks.splice(idx, 1);
  res.status(204).send();
});

// POST /api/tasks/:id/comments
router.post('/:id/comments', validate(commentSchema), (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) { res.status(404).json({ message: 'Task not found' }); return; }
  const user = req.user!;
  const comment: Comment = {
    id: `c-${crypto.randomUUID()}`,
    author: user.name,
    authorAvatar: user.avatar,
    text: (req.body as { text: string }).text,
    createdAt: new Date().toISOString(),
  };
  task.comments.push(comment);
  task.updatedAt = new Date().toISOString();
  res.status(201).json(comment);
});

export { router as tasksRouter };
