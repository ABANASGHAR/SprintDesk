import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useBoardStore } from '../../../store/useBoardStore';

interface TrendChartProps {
  data?: Array<{ day: string; completed: number; remaining: number }>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data: propData }) => {
  const { tasks } = useBoardStore();

  const chartData = useMemo(() => {
    if (propData) return propData;

    const totalTasks = tasks.length || 30;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const reviewTasks = tasks.filter((t) => t.status === 'review').length;

    // Build trend trajectory based on current sprint state
    const d1 = Math.max(1, Math.round(completedTasks * 0.1));
    const d3 = Math.max(d1, Math.round(completedTasks * 0.3));
    const d5 = Math.max(d3, Math.round(completedTasks * 0.5));
    const d7 = Math.max(d5, Math.round(completedTasks * 0.7));
    const d9 = Math.max(d7, Math.round(completedTasks * 0.85));
    const currentDay = completedTasks;
    const targetProjected = Math.min(totalTasks, completedTasks + inProgressTasks + reviewTasks);

    return [
      { day: 'Day 1', completed: d1, remaining: totalTasks - d1 },
      { day: 'Day 3', completed: d3, remaining: totalTasks - d3 },
      { day: 'Day 5', completed: d5, remaining: totalTasks - d5 },
      { day: 'Day 7', completed: d7, remaining: totalTasks - d7 },
      { day: 'Day 9', completed: d9, remaining: totalTasks - d9 },
      { day: 'Today', completed: currentDay, remaining: totalTasks - currentDay },
      { day: 'Target', completed: targetProjected, remaining: Math.max(0, totalTasks - targetProjected) },
    ];
  }, [propData, tasks]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888888' }} />
          <YAxis tick={{ fontSize: 12, fill: '#888888' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCompleted)"
            name="Cumulative Completed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

