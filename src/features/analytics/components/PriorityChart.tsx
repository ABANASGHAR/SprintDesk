import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useBoardStore } from '../../../store/useBoardStore';

export const PriorityChart: React.FC = () => {
  const { tasks } = useBoardStore();

  const data = React.useMemo(() => {
    const columns = [
      { id: 'backlog', name: 'Backlog' },
      { id: 'in_progress', name: 'In Progress' },
      { id: 'review', name: 'Review' },
      { id: 'done', name: 'Done' },
    ];

    return columns.map((col) => {
      const colTasks = tasks.filter((t) => t.status === col.id);
      return {
        column: col.name,
        Low: colTasks.filter((t) => t.priority === 'low').length,
        Medium: colTasks.filter((t) => t.priority === 'medium').length,
        High: colTasks.filter((t) => t.priority === 'high').length,
        Urgent: colTasks.filter((t) => t.priority === 'urgent').length,
      };
    });
  }, [tasks]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="column" tick={{ fontSize: 12, fill: '#888888' }} />
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
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
          />
          <Bar dataKey="Low" fill="#10b981" stackId="a" />
          <Bar dataKey="Medium" fill="#3b82f6" stackId="a" />
          <Bar dataKey="High" fill="#f59e0b" stackId="a" />
          <Bar dataKey="Urgent" fill="#ef4444" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
