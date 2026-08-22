import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '../store/useBoardStore';
import type { Task } from '../types/task';

describe('useBoardStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useBoardStore.setState({
      tasks: [],
      history: [],
      selectedTaskId: null,
      filterPriority: 'all',
      filterAssignee: 'all',
      searchQuery: '',
      isInitialized: false,
    });
  });

  const sampleTask: Omit<Task, 'id' | 'createdAt'> = {
    title: 'Implement Dark Mode',
    description: 'Add support for dark and light themes',
    status: 'backlog',
    priority: 'high',
    assignee: {
      id: 'u-1',
      name: 'Emily Johnson',
      role: 'Frontend Engineer',
    },
    dueDate: '2026-09-01',
    storyPoints: 5,
    tags: ['UI', 'Feature'],
    comments: [],
  };

  it('adds a new task with generated ID and timestamp', () => {
    const created = useBoardStore.getState().addTask(sampleTask);

    expect(created.id).toBeDefined();
    expect(created.title).toBe(sampleTask.title);
    expect(created.status).toBe('backlog');

    const tasks = useBoardStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(created.id);
  });

  it('moves task between status columns and maintains history', () => {
    const task1 = useBoardStore.getState().addTask(sampleTask);
    expect(task1.status).toBe('backlog');

    useBoardStore.getState().moveTask(task1.id, 'in_progress');

    const updatedTasks = useBoardStore.getState().tasks;
    const movedTask = updatedTasks.find((t) => t.id === task1.id);
    expect(movedTask?.status).toBe('in_progress');

    const history = useBoardStore.getState().history;
    expect(history.length).toBeGreaterThan(0);
  });

  it('deletes a task and deselects it if selected', () => {
    const task1 = useBoardStore.getState().addTask(sampleTask);
    useBoardStore.getState().setSelectedTaskId(task1.id);
    expect(useBoardStore.getState().selectedTaskId).toBe(task1.id);

    useBoardStore.getState().deleteTask(task1.id);

    expect(useBoardStore.getState().tasks).toHaveLength(0);
    expect(useBoardStore.getState().selectedTaskId).toBeNull();
  });

  it('updates task properties correctly', () => {
    const task1 = useBoardStore.getState().addTask(sampleTask);

    useBoardStore.getState().updateTask(task1.id, {
      title: 'Updated Title',
      priority: 'urgent',
    });

    const task = useBoardStore.getState().tasks.find((t) => t.id === task1.id);
    expect(task?.title).toBe('Updated Title');
    expect(task?.priority).toBe('urgent');
  });

  it('supports undoing the last state-modifying action', () => {
    const task1 = useBoardStore.getState().addTask(sampleTask);
    expect(useBoardStore.getState().tasks).toHaveLength(1);

    useBoardStore.getState().moveTask(task1.id, 'done');
    expect(useBoardStore.getState().tasks[0].status).toBe('done');

    const undoSuccess = useBoardStore.getState().undoLastAction();
    expect(undoSuccess).toBe(true);

    const revertedTasks = useBoardStore.getState().tasks;
    expect(revertedTasks[0].status).toBe('backlog');
  });

  it('adds comments to a task', () => {
    const task1 = useBoardStore.getState().addTask(sampleTask);

    useBoardStore.getState().addComment(task1.id, 'Great progress on this', 'Michael Brown');

    const task = useBoardStore.getState().tasks.find((t) => t.id === task1.id);
    expect(task?.comments).toHaveLength(1);
    expect(task?.comments?.[0].text).toBe('Great progress on this');
    expect(task?.comments?.[0].author).toBe('Michael Brown');
  });
});