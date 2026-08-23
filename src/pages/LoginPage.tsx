import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/authApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
import { Lock, User as UserIcon, Sparkles, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { showToast } = useToast();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await authApi.login(username, password);
      
      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
        avatar: data.image,
        role: 'Tech Lead',
      };

      setSession(user, data.accessToken, data.refreshToken, rememberMe);
      showToast('Welcome back!', 'success', 'Logged in successfully');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please check your username & password.';
      setError(msg);
      showToast('Login Failed', 'error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white shadow-xs transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sign in to SprintDesk
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sprint management dashboard for software development teams
          </p>
        </div>

        <div className="rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-semibold">
            <span>Demo Accounts (DummyJSON)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => { setUsername('emilys'); setPassword('emilyspass'); }}
              className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium hover:bg-indigo-50 cursor-pointer"
            >
              emilys / emilyspass
            </button>
            <button
              type="button"
              onClick={() => { setUsername('michaelw'); setPassword('michaelwpass'); }}
              className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium hover:bg-indigo-50 cursor-pointer"
            >
              michaelw / michaelwpass
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            required
            autoComplete="username"
            placeholder="e.g. emilys"
            leftIcon={<UserIcon className="h-4 w-4" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Strength: {strength.label}</span>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={'h-full ' + strength.color + ' transition-all'}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember me (30-day session)</span>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
