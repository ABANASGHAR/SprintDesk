import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../../types/task';
import { useBoardStore } from '../../../store/useBoardStore';
import { formatDate, getPriorityBadgeClass, isOverdue, isDueSoon } from '../../../utils/formatters';
import { Calendar, MessageSquare, GripVertical, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay = false }) => {
  const { setSelectedTaskId } = useBoardStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const overdue = isOverdue(task.dueDate);
  const dueSoon = isDueSoon(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedTaskId(task.id)}
      className={`group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer select-none ${
        isOverlay ? 'shadow-2xl ring-2 ring-indigo-500 scale-105' : ''
      }`}
    >
      {/* Top badges & drag handle */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider ${getPriorityBadgeClass(
            task.priority
          )}`}
        >
          {task.priority}
        </span>

        <div className="flex items-center gap-1.5">
          {task.storyPoints !== undefined && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {task.storyPoints}
            </span>
          )}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Drag task card"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1.5 leading-snug">
        {task.title}
      </h4>

      {/* Description Snippet */}
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
        {task.description}
      </p>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        {/* Due date indicator */}
        <div
          className={`flex items-center gap-1 text-[11px] ${
            overdue
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : dueSoon
              ? 'text-amber-600 dark:text-amber-400 font-medium'
              : 'text-slate-400'
          }`}
        >
          {overdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Comments & Assignee */}
        <div className="flex items-center gap-2">
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-0.5 text-slate-400">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-[10px]">{task.comments.length}</span>
            </div>
          )}
          <img
            src={task.assignee?.avatar || 'https://dummyjson.com/icon/michaelw/128'}
            alt={task.assignee?.name || 'Assignee'}
            title={task.assignee?.name}
            className="h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
          />
        </div>
      </div>
    </div>
  );
};
