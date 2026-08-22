import React from 'react';
import { KanbanBoard } from '../features/board/components/KanbanBoard';

export const BoardPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <KanbanBoard />
    </div>
  );
};
export default BoardPage;
