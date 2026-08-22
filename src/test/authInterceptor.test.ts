import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  dummyJsonClient,
  setAccessToken,
  getAccessToken,
  setSimulateTokenExpiry,
} from '../api/client';

describe('Auth Interceptors & Token Lifecycle', () => {
  beforeEach(() => {
    localStorage.clear();
    setAccessToken(null);
    setSimulateTokenExpiry(false);
    vi.restoreAllMocks();
  });

  it('manages in-memory access token state correctly', () => {
    expect(getAccessToken()).toBeNull();
    setAccessToken('mock_access_token_123');
    expect(getAccessToken()).toBe('mock_access_token_123');
  });

  it('attaches Bearer access token to outgoing requests in request interceptor', () => {
    setAccessToken('valid_jwt_token');

    const mockConfig: any = { headers: {} };
    const interceptorHandler = (dummyJsonClient.interceptors.request as any).handlers[0].fulfilled;
    const transformedConfig = interceptorHandler(mockConfig);

    expect(transformedConfig.headers.Authorization).toBe('Bearer valid_jwt_token');
  });

  it('attaches simulated expired token when simulateTokenExpiry is active', () => {
    setAccessToken('valid_jwt_token');
    setSimulateTokenExpiry(true);

    const mockConfig: any = { headers: {} };
    const interceptorHandler = (dummyJsonClient.interceptors.request as any).handlers[0].fulfilled;
    const transformedConfig = interceptorHandler(mockConfig);

    expect(transformedConfig.headers.Authorization).toBe('Bearer EXPIRED_TOKEN_MOCK');
  });

  it('silently refreshes token on 401 response and retries the original request', async () => {
    localStorage.setItem('sprintdesk_refresh_token', 'valid_refresh_token');

    // Mock axios.post for the refresh endpoint
    const postSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        accessToken: 'newly_minted_access_token',
        refreshToken: 'new_refresh_token_456',
      },
    });

    // Mock adapter for retry of original client call
    dummyJsonClient.defaults.adapter = vi.fn().mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    const errorHandler = (dummyJsonClient.interceptors.response as any).handlers[0].rejected;

    const originalRequest: any = {
      headers: {},
      _retry: false,
    };

    const mockError = {
      config: originalRequest,
      response: { status: 401 },
    };

    const retryPromise = errorHandler(mockError);
    await retryPromise;

    expect(postSpy).toHaveBeenCalledWith('https://dummyjson.com/auth/refresh', {
      refreshToken: 'valid_refresh_token',
      expiresInMins: 30,
    });

    expect(getAccessToken()).toBe('newly_minted_access_token');
    expect(localStorage.getItem('sprintdesk_refresh_token')).toBe('new_refresh_token_456');

    postSpy.mockRestore();
  });
});