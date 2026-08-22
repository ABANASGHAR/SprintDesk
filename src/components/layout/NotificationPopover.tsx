import React from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Button } from '../ui/Button';
import { Check, Bell, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const NotificationPopover: React.FC = () => {
  const {
    notifications,
    isPopoverOpen,
    setIsPopoverOpen,
    markAsRead,
    markAllAsRead,
    currentPage,
    setCurrentPage,
    pageSize,
  } = useNotificationStore();

  if (!isPopoverOpen) return null;

  const totalPages = Math.ceil(notifications.length / pageSize) || 1;
  const paginatedNotifs = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
          <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {notifications.filter((n) => !n.read).length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} title="Mark all as read">
            <Check className="h-4 w-4 mr-1" />
            <span className="text-xs">All Read</span>
          </Button>
          <button
            onClick={() => setIsPopoverOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:border-slate-800">
        {paginatedNotifs.length > 0 ? (
          paginatedNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${!item.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${!item.read ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {item.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-800/30">
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
