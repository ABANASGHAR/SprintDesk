import { create } from 'zustand';
import type { Task, TaskStatus, TaskPriority } from '../types/task';

interface BoardHistoryState {
  tasks: Task[];
}

interface BoardState {
  tasks: Task[];
  history: BoardHistoryState[];
  selectedTaskId: string | null;
  filterPriority: TaskPriority | 'all';
  filterAssignee: string | 'all';
  searchQuery: string;
  isInitialized: boolean;

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex?: number) => void;
  reorderTask: (activeId: string, overId: string) => void;
  undoLastAction: () => boolean;
  setSelectedTaskId: (id: string | null) => void;
  setFilterPriority: (priority: TaskPriority | 'all') => void;
  setFilterAssignee: (assigneeId: string | 'all') => void;
  setSearchQuery: (query: string) => void;
  addComment: (taskId: string, commentText: string, authorName: string, avatar?: string) => void;
}

const STORAGE_KEY = 'sprintdesk_board_tasks';

const loadPersistedTasks = (): Task[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const savePersistedTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota
  }
};

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: loadPersistedTasks() || [],
  history: [],
  selectedTaskId: null,
  filterPriority: 'all',
  filterAssignee: 'all',
  searchQuery: '',
  isInitialized: false,

  setTasks: (tasks) => {
    const existing = loadPersistedTasks();
    const finalTasks = existing && existing.length > 0 ? existing : tasks;
    savePersistedTasks(finalTasks);
    set({ tasks: finalTasks, isInitialized: true });
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: 'TASK-' + Date.now().toString().slice(-4),
      createdAt: new Date().toISOString(),
      comments: taskData.comments || [],
    };
    const currentTasks = get().tasks;
    const nextTasks = [newTask, ...currentTasks];
    savePersistedTasks(nextTasks);
    set((state) => ({
      history: [...state.history.slice(-10), { tasks: currentTasks }],
      tasks: nextTasks,
    }));
    return newTask;
  },

  updateTask: (id, updates) => {
    const currentTasks = get().tasks;
    const nextTasks = currentTasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    savePersistedTasks(nextTasks);
    set((state) => ({
      history: [...state.history.slice(-10), { tasks: currentTasks }],
      tasks: nextTasks,
    }));
  },

  deleteTask: (id) => {
    const currentTasks = get().tasks;
    const nextTasks = currentTasks.filter((t) => t.id !== id);
    savePersistedTasks(nextTasks);
    set((state) => ({
      history: [...state.history.slice(-10), { tasks: currentTasks }],
      tasks: nextTasks,
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    }));
  },

  moveTask: (taskId, newStatus, newIndex) => {
    const currentTasks = get().tasks;
    const taskIndex = currentTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = currentTasks[taskIndex];
    const filteredTasks = currentTasks.filter((t) => t.id !== taskId);
    const updatedTask = { ...task, status: newStatus };

    let nextTasks: Task[];
    if (typeof newIndex === 'number' && newIndex >= 0) {
      // Find where in overall list this index corresponds to
      const sameStatusTasks = filteredTasks.filter((t) => t.status === newStatus);
      const targetOverTask = sameStatusTasks[newIndex];
      if (targetOverTask) {
        const insertPos = filteredTasks.findIndex((t) => t.id === targetOverTask.id);
        filteredTasks.splice(insertPos, 0, updatedTask);
        nextTasks = [...filteredTasks];
      } else {
        nextTasks = [...filteredTasks, updatedTask];
      }
    } else {
      nextTasks = [...filteredTasks, updatedTask];
    }

    savePersistedTasks(nextTasks);
    set((state) => ({
      history: [...state.history.slice(-10), { tasks: currentTasks }],
      tasks: nextTasks,
    }));
  },

  reorderTask: (activeId, overId) => {
    const currentTasks = get().tasks;
    const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
    const overIndex = currentTasks.findIndex((t) => t.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

    const nextTasks = [...currentTasks];
    const [moved] = nextTasks.splice(activeIndex, 1);
    const overTask = currentTasks[overIndex];
    moved.status = overTask.status;
    nextTasks.splice(overIndex, 0, moved);

    savePersistedTasks(nextTasks);
    set((state) => ({
      history: [...state.history.slice(-10), { tasks: currentTasks }],
      tasks: nextTasks,
    }));
  },

  undoLastAction: () => {
    const { history } = get();
    if (history.length === 0) return false;

    const previousState = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    savePersistedTasks(previousState.tasks);
    set({
      tasks: previousState.tasks,
      history: newHistory,
    });
    return true;
  },

  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setFilterAssignee: (assigneeId) => set({ filterAssignee: assigneeId }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addComment: (taskId, text, authorName, avatar) => {
    const currentTasks = get().tasks;
    const comment = {
      id: 'c-' + Date.now(),
      author: authorName,
      avatar: avatar || 'https://dummyjson.com/icon/emilys/128',
      text,
      createdAt: new Date().toISOString(),
    };

    const nextTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [...(t.comments || []), comment],
        };
      }
      return t;
    });

    savePersistedTasks(nextTasks);
    set({ tasks: nextTasks });
  },
}));
