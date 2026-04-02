export type CategoryId = 'learning' | 'focus' | 'productivity' | 'study';
export type CategoryIconKey = 'brain' | 'timer' | 'zap' | 'book-open';

export interface CategoryConfig {
  id: CategoryId;
  name: string;
  icon: CategoryIconKey;
  tokenKey: 'learn' | 'focus' | 'prod' | 'study';
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'learning', name: 'Learning & Memory', icon: 'brain', tokenKey: 'learn' },
  { id: 'focus', name: 'Focus & Sessions', icon: 'timer', tokenKey: 'focus' },
  { id: 'productivity', name: 'Productivity', icon: 'zap', tokenKey: 'prod' },
  { id: 'study', name: 'Study Techniques', icon: 'book-open', tokenKey: 'study' },
];
