import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { User, Task, Sprint, Notification } from '../types/index.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MockData {
  users: Omit<User, 'passwordHash'>[];
  sprints: Sprint[];
  tasks: Task[];
  notifications: Notification[];
}

const DATA_PATH = path.resolve(__dirname, '../../../public/mock-data.json');
const raw: MockData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

// Users - add passwordHash for demo users
export const users: User[] = raw.users.map((u) => ({
  ...u,
  passwordHash: bcrypt.hashSync(u.username + 'pass', 10), // emilys -> emilyspass
}));

export const sprints: Sprint[] = raw.sprints as Sprint[];
export const tasks: Task[] = raw.tasks;
export const notifications: Notification[] = raw.notifications;

// Refresh token store: token -> userId
export const refreshTokens = new Map<string, string>();
