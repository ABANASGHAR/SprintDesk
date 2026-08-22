import { dummyJsonClient } from './client';
import type { LoginResponse, User } from '../types/auth';

export const authApi = {
  login: async (username: string, password: string, expiresInMins: number = 60): Promise<LoginResponse> => {
    const response = await dummyJsonClient.post<LoginResponse>('/auth/login', {
      username,
      password,
      expiresInMins,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await dummyJsonClient.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await dummyJsonClient.post('/auth/refresh', {
      refreshToken,
      expiresInMins: 60,
    });
    return response.data;
  },
};
