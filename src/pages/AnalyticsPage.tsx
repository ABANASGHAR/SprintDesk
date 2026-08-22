import React, { useState } from 'react';
import { VelocityChart } from '../features/analytics/components/VelocityChart';
import { StatusChart } from '../features/analytics/components/StatusChart';
import { PriorityChart } from '../features/analytics/components/PriorityChart';
import { TrendChart } from '../features/analytics/components/TrendChart';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { Download, Calendar } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState('active_sprint');

  const handleExport = () => {
    showToast('Exporting Report', 'info', 'Generating snapshot of sprint metrics...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className='space-y-8'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
            Sprint Analytics & Performance
          </h1>
          <p className='text-xs text-slate-500'>
            Live metrics derived from board state, task distributions, and sprint velocity trends
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300'>
            <Calendar className='h-3.5 w-3.5 text-slate-400' />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className='bg-transparent focus:outline-none cursor-pointer'
            >
              <option value='active_sprint'>Current Sprint (24)</option>
              <option value='last_3_sprints'>Last 3 Sprints</option>
              <option value='all_time'>All Time</option>
            </select>
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={handleExport}
            leftIcon={<Download className='h-3.5 w-3.5' />}
          >
            Export Report
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4'>
          <div>
            <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>
              Sprint Velocity (Completed vs Planned)
            </h3>
            <p className='text-xs text-slate-500'>Historical comparison of completed story points</p>
          </div>
          <VelocityChart />
        </div>

        <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4'>
          <div>
            <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>
              Task Status Distribution
            </h3>
            <p className='text-xs text-slate-500'>Live proportion of tasks across columns</p>
          </div>
          <StatusChart />
        </div>

        <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4'>
          <div>
            <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>
              Priority Breakdown by Column
            </h3>
            <p className='text-xs text-slate-500'>Distribution of urgency across workflow stages</p>
          </div>
          <PriorityChart />
        </div>

        <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4'>
          <div>
            <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>
              Sprint 24 Completion Trend
            </h3>
            <p className='text-xs text-slate-500'>Cumulative task completion over sprint duration</p>
          </div>
          <TrendChart />
        </div>
      </div>
    </div>
  );
};
