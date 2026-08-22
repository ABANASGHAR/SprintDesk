export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface TaskComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: Assignee;
  dueDate: string;
  createdAt: string;
  sprint?: string;
  storyPoints?: number;
  tags?: string[];
  comments?: TaskComment[];
}

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  color: string;
}
