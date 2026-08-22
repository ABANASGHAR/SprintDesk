import { jsonPlaceholderClient } from './client';

export interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const notificationsApi = {
  fetchLatestPosts: async (limit: number = 5): Promise<JsonPlaceholderPost[]> => {
    const response = await jsonPlaceholderClient.get<JsonPlaceholderPost[]>(`/posts?_limit=${limit}`);
    return response.data;
  },
};
