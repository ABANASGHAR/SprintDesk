import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../../types/task';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
}

export const Column: React.FC<ColumnProps> = ({ id, title, tasks, onAddTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id,
    },
  });

  const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);

  const columnStyles = {
    backlog: 'border-t-slate-400',
    in_progress: 'border-t-indigo-500',
    review: 'border-t-amber-500',
    done: 'border-t-emerald-500',
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-[280px] sm:min-w-[300px] flex-1 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 p-3.5 border-t-4 ${
        columnStyles[id]
      } ${isOver ? 'bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-400/50' : ''} transition-all`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <span className="flex h-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400" title="Total Story Points">
            {totalPoints} pts
          </span>
          <button
            onClick={() => onAddTask(id)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            aria-label={`Add task to ${title}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task Cards Sortable Container */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-[150px] pr-0.5">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800/80 p-4 text-center">
            <span className="text-xs text-slate-400 font-medium">Drop tasks here</span>
          </div>
        )}
      </div>
    </div>
  );
};
