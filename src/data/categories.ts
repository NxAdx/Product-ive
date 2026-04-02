export type CategoryId = 'learning' | 'focus' | 'productivity' | 'study';

export interface CategoryConfig {
  id: CategoryId;
  name: string;
  icon: string;
  tokenKey: 'learn' | 'focus' | 'prod' | 'study';
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'learning',     name: 'Learning &\nMemory', icon: '🧠', tokenKey: 'learn' },
  { id: 'focus',        name: 'Focus &\nSessions',  icon: '⏱', tokenKey: 'focus' },
  { id: 'productivity', name: 'Produc-\ntivity',    icon: '⚡', tokenKey: 'prod'  },
  { id: 'study',        name: 'Study\nTechniques',  icon: '📖', tokenKey: 'study' },
];
