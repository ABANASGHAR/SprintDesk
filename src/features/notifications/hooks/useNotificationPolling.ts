import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../../api/notificationsApi';
import { useNotificationStore } from '../../../store/useNotificationStore';
import { useToast } from '../../../hooks/useToast';

export const useNotificationPolling = () => {
  const { addNotification, isPopoverOpen } = useNotificationStore();
  const { showToast } = useToast();
  const isDocumentVisible = useRef(!document.hidden);
  const seenIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleVisibilityChange = () => {
      isDocumentVisible.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const { data: posts } = useQuery({
    queryKey: ['notifications-poll'],
    queryFn: async () => {
      if (!isDocumentVisible.current) {
        return [];
      }
      return notificationsApi.fetchLatestPosts(5);
    },
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    posts.forEach((post) => {
      if (!seenIds.current.has(post.id)) {
        seenIds.current.add(post.id);
        const newNotif = {
          id: 'poll-' + post.id,
          title: 'Update on Task #' + post.id,
          message: post.title.slice(0, 50) + '...',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'system' as const,
        };
        addNotification(newNotif);

        if (!isPopoverOpen) {
          showToast(newNotif.title, 'info', newNotif.message);
        }
      }
    });
  }, [posts, addNotification, isPopoverOpen, showToast]);
};
