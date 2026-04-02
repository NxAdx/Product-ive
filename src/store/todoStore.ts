import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  ruleIds: string[];        // tags: which rules this relates to
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface TodoStore {
  todos: Todo[];
  addTodo: (title: string, ruleIds: string[], priority: 'high' | 'medium' | 'low', dueDate?: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  getTodosForRule: (ruleId: string) => Todo[];
  getActiveTodos: () => Todo[];
  getCompletedToday: () => number;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],

      addTodo: (title, ruleIds, priority, dueDate) => {
        const newTodo: Todo = {
          id: Math.random().toString(36),
          title,
          completed: false,
          ruleIds,
          priority,
          createdAt: new Date().toISOString(),
          dueDate,
        };
        set(s => ({ todos: [...s.todos, newTodo] }));
      },

      removeTodo: (id) => {
        set(s => ({ todos: s.todos.filter(t => t.id !== id) }));
      },

      toggleTodo: (id) => {
        set(s => ({
          todos: s.todos.map(t =>
            t.id === id
              ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
              : t
          ),
        }));
      },

      updateTodo: (id, updates) => {
        set(s => ({
          todos: s.todos.map(t => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      getTodosForRule: (ruleId) => {
        return get().todos.filter(t => t.ruleIds.includes(ruleId) && !t.completed);
      },

      getActiveTodos: () => {
        return get().todos.filter(t => !t.completed).sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      },

      getCompletedToday: () => {
        const today = new Date().toDateString();
        return get().todos.filter(t => {
          if (!t.completedAt) return false;
          return new Date(t.completedAt).toDateString() === today;
        }).length;
      },
    }),
    { name: 'todos', storage: createJSONStorage(() => AsyncStorage) }
  )
);
