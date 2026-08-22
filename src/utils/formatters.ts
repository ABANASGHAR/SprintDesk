export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No due date';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  now.setHours(0,0,0,0);
  return d < now;
};

export const isDueSoon = (dateString?: string): boolean => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
};

export const getPriorityBadgeClass = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
    case 'high':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    case 'medium':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
    case 'low':
    default:
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
  }
};
