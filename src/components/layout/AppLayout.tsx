import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useNotificationPolling } from '../../features/notifications/hooks/useNotificationPolling';
import { useBoardStore } from '../../store/useBoardStore';
import { tasksApi } from '../../api/tasksApi';
import { useQuery } from '@tanstack/react-query';
import { useNotificationStore } from '../../store/useNotificationStore';

export const AppLayout: React.FC = () => {
  useNotificationPolling();
  const { setTasks, isInitialized } = useBoardStore();
  const { setNotifications } = useNotificationStore();

  const { data: initialData } = useQuery({
    queryKey: ['initial-mock-data'],
    queryFn: tasksApi.getInitialData,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (initialData) {
      if (!isInitialized) {
        setTasks(initialData.tasks);
      }
      if (initialData.notifications) {
        setNotifications(initialData.notifications);
      }
    }
  }, [initialData, isInitialized, setTasks, setNotifications]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};
