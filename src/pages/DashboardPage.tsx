import React from 'react';
import { Link } from 'react-router-dom';
import { useBoardStore } from '../store/useBoardStore';
import { useAuthStore } from '../store/useAuthStore';
import { DataTable } from '../components/ui/DataTable';
import { VelocityChart } from '../features/analytics/components/VelocityChart';
import { StatusChart } from '../features/analytics/components/StatusChart';
import { formatDate, getPriorityBadgeClass } from '../utils/formatters';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  KanbanSquare,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks } = useBoardStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'review').length;
  const completedPoints = tasks
    .filter((t) => t.status === 'done')
    .reduce((acc, t) => acc + (t.storyPoints || 0), 0);

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done');

  const tableColumns = [
    {
      key: 'id',
      header: 'Key',
      sortable: true,
      render: (t: any) => (
        <span className='font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400'>
          {t.id}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (t: any) => (
        <div className='max-w-xs truncate font-medium text-slate-900 dark:text-slate-100'>
          {t.title}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t: any) => (
        <span className='capitalize text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'>
          {t.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (t: any) => (
        <span className={'capitalize text-[10px] font-bold px-2 py-0.5 rounded ' + getPriorityBadgeClass(t.priority)}>
          {t.priority}
        </span>
      ),
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (t: any) => (
        <div className='flex items-center gap-2'>
          <img
            src={t.assignee?.avatar || 'https://dummyjson.com/icon/emilys/128'}
            alt=''
            className='h-5 w-5 rounded-full object-cover'
          />
          <span className='text-xs text-slate-700 dark:text-slate-300 truncate max-w-[100px]'>
            {t.assignee?.name}
          </span>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (t: any) => <span className='text-xs text-slate-500'>{formatDate(t.dueDate)}</span>,
    },
  ];

  return (
    <div className='space-y-8'>
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl'>
        <div className='relative z-10 max-w-2xl space-y-2'>
          <div className='inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md'>
            <Sparkles className='h-3.5 w-3.5' />
            <span>Sprint 24 in progress</span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
            Welcome back, {user?.firstName || user?.username || 'Team Lead'}
          </h1>
          <p className='text-sm text-indigo-100 leading-relaxed'>
            Your team has completed {completedTasks} of {totalTasks} tasks. Sprint ends in 3 days.
          </p>
          <div className='pt-2'>
            <Link
              to='/board'
              className='inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-50 transition-colors shadow-sm'
            >
              Open Kanban Board
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase text-slate-500 tracking-wider'>Total Tasks</p>
            <h3 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1'>{totalTasks}</h3>
            <p className='text-xs text-slate-400 mt-0.5'>Active Sprint dataset</p>
          </div>
          <div className='h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
            <KanbanSquare className='h-6 w-6' />
          </div>
        </div>

        <div className='p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase text-slate-500 tracking-wider'>In Progress</p>
            <h3 className='text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1'>{inProgressTasks}</h3>
            <p className='text-xs text-slate-400 mt-0.5'>{reviewTasks} in review</p>
          </div>
          <div className='h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400'>
            <Clock className='h-6 w-6' />
          </div>
        </div>

        <div className='p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase text-slate-500 tracking-wider'>Completed</p>
            <h3 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1'>{completedTasks}</h3>
            <p className='text-xs text-slate-400 mt-0.5'>{completedPoints} points delivered</p>
          </div>
          <div className='h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
            <CheckCircle2 className='h-6 w-6' />
          </div>
        </div>

        <div className='p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase text-slate-500 tracking-wider'>Urgent</p>
            <h3 className='text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1'>{urgentTasks.length}</h3>
            <p className='text-xs text-slate-400 mt-0.5'>High priority tasks</p>
          </div>
          <div className='h-11 w-11 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400'>
            <AlertCircle className='h-6 w-6' />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>Sprint Velocity History</h3>
            <Link to='/analytics' className='text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline'>
              View Detailed Analytics
            </Link>
          </div>
          <VelocityChart />
        </div>

        <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4'>
          <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>Task Status Distribution</h3>
          <StatusChart />
        </div>
      </div>

      <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>Active Sprint Tasks</h3>
            <p className='text-xs text-slate-500'>Search, sort, and inspect tasks in Sprint 24</p>
          </div>
          <Link
            to='/board'
            className='text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline'
          >
            Go to Kanban
          </Link>
        </div>
        <DataTable data={tasks} columns={tableColumns} pageSize={5} searchKey='title' />
      </div>
    </div>
  );
};
