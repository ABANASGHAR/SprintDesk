import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useBoardStore } from '../../../store/useBoardStore';

interface VelocityChartProps {
  data?: Array<{ sprint: string; completed: number; planned: number }>;
}

export const VelocityChart: React.FC<VelocityChartProps> = ({ data: propData }) => {
  const { tasks } = useBoardStore();

  const chartData = useMemo(() => {
    if (propData) return propData;

    // Calculate current sprint (Sprint 24) velocity dynamically from board store
    const currentCompletedPoints = tasks
      .filter((t) => t.status === 'done')
      .reduce((acc, t) => acc + (t.storyPoints || 0), 0);

    const currentTotalPoints = tasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);

    return [
      { sprint: 'Sprint 20', completed: 22, planned: 25 },
      { sprint: 'Sprint 21', completed: 24, planned: 24 },
      { sprint: 'Sprint 22', completed: 28, planned: 26 },
      { sprint: 'Sprint 23', completed: 31, planned: 30 },
      {
        sprint: 'Sprint 24 (Live)',
        completed: currentCompletedPoints || 18,
        planned: currentTotalPoints || 32,
      },
    ];
  }, [propData, tasks]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="sprint" tick={{ fontSize: 12, fill: '#888888' }} />
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
          <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Completed Points" />
          <Bar dataKey="planned" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Planned Points" opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

