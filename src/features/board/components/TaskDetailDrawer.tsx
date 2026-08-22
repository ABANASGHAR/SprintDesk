import React, { useState } from 'react';
import { useBoardStore } from '../../../store/useBoardStore';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import {
  X,
  Trash2,
  MessageSquare,
  Send,
  AlertCircle,
} from 'lucide-react';
import { formatDate, isOverdue } from '../../../utils/formatters';
import type { TaskPriority, TaskStatus } from '../../../types/task';

export const TaskDetailDrawer: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    addComment,
  } = useBoardStore();
  const { showToast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const task = tasks.find((t) => t.id === selectedTaskId);

  if (!selectedTaskId || !task) return null;

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { status });
    showToast('Task updated', 'success', 'Moved to ' + status.replace('_', ' '));
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    updateTask(task.id, { priority });
    showToast('Priority updated', 'success');
  };

  const handleDueDateChange = (dueDate: string) => {
    updateTask(task.id, { dueDate });
  };

  const handleStoryPointsChange = (points: number) => {
    updateTask(task.id, { storyPoints: points });
  };

  const handleTitleChange = (title: string) => {
    updateTask(task.id, { title });
  };

  const handleDescriptionChange = (description: string) => {
    updateTask(task.id, { description });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText.trim(), 'Emily Smith', 'https://dummyjson.com/icon/emilys/128');
    setCommentText('');
    showToast('Comment added', 'success');
  };

  const handleDeleteConfirm = () => {
    deleteTask(task.id);
    setIsDeleteModalOpen(false);
    showToast('Task deleted', 'info', 'Task ' + task.id + ' has been removed.');
  };

  const overdue = isOverdue(task.dueDate);

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={() => setSelectedTaskId(null)}
        />

        {/* Drawer Panel */}
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 animate-slide-left overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded">
                {task.id}
              </span>
              <span className="text-xs text-slate-400">in {task.sprint || 'Sprint 24'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedTaskId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Title editable */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Title
              </label>
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-lg font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Quick Properties Grid */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Due Date</label>
                <input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    overdue
                      ? 'border-rose-400 text-rose-600 dark:text-rose-400'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Story Points</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={task.storyPoints ?? 0}
                  onChange={(e) => handleStoryPointsChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Assignee Card */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Assignee
              </label>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <img
                  src={task.assignee?.avatar || 'https://dummyjson.com/icon/michaelw/128'}
                  alt={task.assignee?.name}
                  className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {task.assignee?.name || 'Unassigned'}
                  </h4>
                  <p className="text-xs text-slate-500">{task.assignee?.role || 'Team Member'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={task.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                placeholder="Add detailed task requirements, AC, or steps..."
              />
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Thread */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Activity & Comments ({task.comments?.length || 0})
                </h4>
              </div>

              {/* Comments List */}
              <div className="space-y-3 mb-4">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                        {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No comments yet. Start the conversation!
                  </p>
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" size="sm" className="shrink-0" disabled={!commentText.trim()}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Task Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <p className="text-sm">
              Are you sure you want to delete task <strong>{task.title}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
