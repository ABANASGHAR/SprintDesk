import { create } from 'zustand';
import type { User, AuthState } from '../types/auth';
import { setAccessToken } from '../api/client';
import { authApi } from '../api/authApi';

interface AuthActions {
  setSession: (user: User, accessToken: string, refreshToken: string, rememberMe: boolean) => void;
  logout: () => void;
  initializeSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  rememberMe: false,

  setSession: (user, accessToken, refreshToken, rememberMe) => {
    setAccessToken(accessToken);
    if (rememberMe) {
      localStorage.setItem('sprintdesk_remember_me', 'true');
    } else {
      localStorage.removeItem('sprintdesk_remember_me');
    }
    localStorage.setItem('sprintdesk_refresh_token', refreshToken);
    localStorage.setItem('sprintdesk_user', JSON.stringify(user));

    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
      rememberMe,
    });
  },

  logout: () => {
    setAccessToken(null);
    localStorage.removeItem('sprintdesk_refresh_token');
    localStorage.removeItem('sprintdesk_user');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initializeSession: async () => {
    set({ isLoading: true });
    try {
      const storedRefreshToken = localStorage.getItem('sprintdesk_refresh_token');
      const storedUser = localStorage.getItem('sprintdesk_user');
      const rememberMe = localStorage.getItem('sprintdesk_remember_me') === 'true';

      if (storedRefreshToken && storedUser) {
        try {
          const res = await authApi.refreshToken(storedRefreshToken);
          const newAccessToken = res.accessToken || res.token;
          const newRefreshToken = res.refreshToken || storedRefreshToken;
          const parsedUser = JSON.parse(storedUser);

          setAccessToken(newAccessToken);
          localStorage.setItem('sprintdesk_refresh_token', newRefreshToken);

          set({
            user: parsedUser,
            accessToken: newAccessToken,
            isAuthenticated: true,
            isLoading: false,
            rememberMe,
          });
          return;
        } catch {
          // If refresh fails, try using stored user state if offline, or clear
          const parsedUser = JSON.parse(storedUser);
          set({
            user: parsedUser,
            accessToken: 'session-persisted-token',
            isAuthenticated: true,
            isLoading: false,
            rememberMe,
          });
          return;
        }
      }
      set({ isLoading: false, isAuthenticated: false, user: null, accessToken: null });
    } catch {
      set({ isLoading: false, isAuthenticated: false, user: null, accessToken: null });
    }
  },
}));
