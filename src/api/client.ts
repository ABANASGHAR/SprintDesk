import axios from 'axios';

export const dummyJsonClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jsonPlaceholderClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const localClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory token management
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

// Simulation of expired token flag for testing bonus requirement
let simulateTokenExpiry = false;
export const setSimulateTokenExpiry = (simulate: boolean) => {
  simulateTokenExpiry = simulate;
};
export const getSimulateTokenExpiry = () => simulateTokenExpiry;

// Interceptor for attaching Bearer token and silent refresh
dummyJsonClient.interceptors.request.use((config) => {
  if (inMemoryAccessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  if (simulateTokenExpiry) {
    config.headers.Authorization = 'Bearer EXPIRED_TOKEN_MOCK';
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

dummyJsonClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return dummyJsonClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('sprintdesk_refresh_token');
        if (!storedRefreshToken) {
          throw new Error('No refresh token');
        }

        const refreshRes = await axios.post('https://dummyjson.com/auth/refresh', {
          refreshToken: storedRefreshToken,
          expiresInMins: 30,
        });

        const newAccessToken = refreshRes.data.accessToken || refreshRes.data.token;
        const newRefreshToken = refreshRes.data.refreshToken;

        setAccessToken(newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('sprintdesk_refresh_token', newRefreshToken);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        simulateTokenExpiry = false;
        return dummyJsonClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        setAccessToken(null);
        localStorage.removeItem('sprintdesk_refresh_token');
        localStorage.removeItem('sprintdesk_user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
