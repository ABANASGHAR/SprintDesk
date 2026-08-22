import { localClient } from './client';
import type { Task } from '../types/task';

export interface MockDataResponse {
  users: Array<{ id: string; name: string; username: string; email: string; avatar: string; role: string }>;
  sprints: Array<{ id: string; name: string; startDate: string; endDate: string; status: string; velocity: number }>;
  tasks: Task[];
  notifications: Array<{ id: string; title: string; message: string; timestamp: string; read: boolean; type: 'assignment' | 'comment' | 'system' | 'alert' }>;
}

export const tasksApi = {
  getInitialData: async (): Promise<MockDataResponse> => {
    const response = await localClient.get<MockDataResponse>('/mock-data.json');
    return response.data;
  },

  getTasks: async (): Promise<Task[]> => {
    const response = await localClient.get<MockDataResponse>('/mock-data.json');
    return response.data.tasks.slice(0, 30);
  },
};
