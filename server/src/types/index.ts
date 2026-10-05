export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  passwordHash: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  velocity: number;
}

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'in-review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'feature' | 'bug' | 'chore' | 'story';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  storyPoints: number;
  assignee: string;
  assigneeAvatar?: string;
  sprintId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  comments: Comment[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'comment' | 'system' | 'alert';
}
