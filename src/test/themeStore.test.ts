import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../store/useThemeStore';

describe('useThemeStore and Dark Mode Toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('initializes with default theme or light', () => {
    const theme = useThemeStore.getState().theme;
    expect(['light', 'dark']).toContain(theme);
  });

  it('toggles theme between light and dark and updates document class', () => {
    useThemeStore.getState().setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('sprintdesk_theme')).toBe('dark');

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('sprintdesk_theme')).toBe('light');
  });

  it('persists set theme directly to localStorage', () => {
    useThemeStore.getState().setTheme('dark');
    expect(localStorage.getItem('sprintdesk_theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});