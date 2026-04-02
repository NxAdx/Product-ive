import { CategoryId } from './categories';

export type EngineType =
  | 'countdown' | 'interval' | 'guided'
  | 'sorter' | 'spaced' | 'awareness' | 'freewrite';

export interface RuleConfig {
  id: string;
  name: string;
  categoryId: CategoryId;
  engine: EngineType;
  shortDescription: string;       // 1 line — shown in rule row
  description: string;            // 2–3 sentences — shown in info sheet
  whyItWorks: string;             // The science
  bestFor: string[];
  engineConfig: any;           // Engine-specific params
  pointsPerSession: number;
  discoveryBonus: number;
}

export const RULES: RuleConfig[] = [
  { 
    id: 'pomodoro', 
    name: 'Pomodoro Technique', 
    categoryId: 'focus',
    engine: 'countdown',
    shortDescription: '25-min focus blocks with 5-min breaks',
    description: 'Work in focused 25-minute intervals, then take a 5-minute break. After four rounds, take a 15–30 minute break.',
    whyItWorks: 'Time-boxing reduces cognitive load and decision fatigue. Scheduled breaks prevent burnout and maintain concentration.',
    bestFor: ['deep work', 'studying', 'writing', 'coding'],
    engineConfig: { workDuration: 25 * 60, breakDuration: 5 * 60, longBreakDuration: 15 * 60, longBreakAfterCycles: 4, cycles: 4 },
    pointsPerSession: 20, 
    discoveryBonus: 25 
  },
  { 
    id: 'pomodoro_90', 
    name: '90-Min Ultradian Rule', 
    categoryId: 'focus',
    engine: 'countdown',
    shortDescription: 'Align work with your 90-min brain cycle',
    description: 'The brain naturally cycles through high-focus and low-focus states every 90 minutes. Work with one full cycle, then take a genuine 20-minute rest.',
    whyItWorks: 'Research by Peretz Lavie shows alertness peaks in 90-minute waves (ultradian rhythms). Fighting them causes fatigue.',
    bestFor: ['creative work', 'complex problem-solving', 'writing'],
    engineConfig: { workDuration: 90 * 60, breakDuration: 20 * 60, cycles: 2 },
    pointsPerSession: 25, 
    discoveryBonus: 25 
  },
  { 
    id: '20_20_20', 
    name: '20-20-20 Rule', 
    categoryId: 'focus',
    engine: 'interval',
    shortDescription: 'Look 20 feet away for 20 seconds every 20 min',
    description: 'Every 20 minutes of screen time, look at something 20 feet away for 20 seconds. Reduces digital eye strain significantly.',
    whyItWorks: 'Focussing on a distant object relaxes the ciliary muscle inside the eye. Recommended by optometrists globally.',
    bestFor: ['long work sessions', 'studying', 'anyone at a screen'],
    engineConfig: { intervalMinutes: 20, prompt: 'Look 20 feet away for 20 seconds', sessionDuration: 2 * 60 * 60, requiresConfirmation: true },
    pointsPerSession: 10, 
    discoveryBonus: 25 
  },
  { 
    id: 'feynman', 
    name: 'Feynman Technique', 
    categoryId: 'learning',
    engine: 'guided',
    shortDescription: 'Explain it simply to understand deeply',
    description: 'Choose a concept, explain it in plain language as if teaching a child, identify your gaps, then return to the source material to fill them.',
    whyItWorks: 'The act of explaining exposes the illusion of knowing. You cannot fake understanding when forced to simplify.',
    bestFor: ['understanding complex topics', 'exam prep', 'any new subject'],
    engineConfig: { steps: [
      { title: 'Choose a topic', prompt: 'What concept do you want to understand?' },
      { title: 'Explain it simply', prompt: 'Explain it as if teaching a 12-year-old. No jargon allowed.' },
      { title: 'Find your gaps', prompt: 'Where did you struggle? What couldn\\'t you explain? List the gaps.' },
      { title: 'Review and simplify', prompt: 'Go back to the source. Now explain the gaps you identified.' },
    ]},
    pointsPerSession: 15, 
    discoveryBonus: 25 
  },
  { 
    id: 'eat_frog', 
    name: 'Eat the Frog', 
    categoryId: 'productivity',
    engine: 'sorter',
    shortDescription: 'Do your most important task first thing',
    description: 'Identify your most important (and often most dreaded) task and do it first. This single habit eliminates procrastination at its root.',
    whyItWorks: 'Willpower and focus are highest in the morning. Completing the hardest task first creates psychological momentum for the rest of the day.',
    bestFor: ['morning routines', 'overcoming procrastination', 'high-priority projects'],
    engineConfig: { sortMode: 'frog', prompt: 'What is your most important task today? The one you\\'ve been avoiding.' },
    pointsPerSession: 15, 
    discoveryBonus: 25 
  },
  { 
    id: 'two_minute', 
    name: '2-Minute Rule', 
    categoryId: 'productivity',
    engine: 'countdown',
    shortDescription: 'If it takes 2 minutes, do it right now',
    description: 'If a task takes less than 2 minutes to complete, do it immediately. Don\\'t schedule it, don\\'t write it down — just do it.',
    whyItWorks: 'The time spent writing down, organising, and revisiting a 2-minute task often exceeds the time to just do it. Reduces backlog anxiety.',
    bestFor: ['email replies', 'small admin tasks', 'quick decisions'],
    engineConfig: { workDuration: 2 * 60, cycles: 1, label: 'Do it NOW', noBreak: true },
    pointsPerSession: 5, 
    discoveryBonus: 25 
  },
  { 
    id: 'srs', 
    name: 'Spaced Repetition (SRS)', 
    categoryId: 'learning',
    engine: 'spaced',
    shortDescription: 'Review at increasing intervals to remember forever',
    description: 'Review material at spaced intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month. Each review strengthens the memory trace.',
    whyItWorks: 'The "forgetting curve" (Ebbinghaus, 1885) shows memory decays predictably. Reviewing just before forgetting is 2–3× more efficient than repeated same-day review.',
    bestFor: ['vocabulary', 'dates and facts', 'formulas', 'any memorisation'],
    engineConfig: { intervals: [1, 3, 7, 14, 30], notifyBeforeMinutes: 60 },
    pointsPerSession: 15, 
    discoveryBonus: 25 
  },
  { 
    id: 'active_recall', 
    name: 'Active Recall', 
    categoryId: 'study',
    engine: 'freewrite',
    shortDescription: 'Test your memory instead of re-reading',
    description: 'Close your notes and write down everything you remember about a topic. Then check what you missed. This beats re-reading by 50–100%.',
    whyItWorks: 'Retrieval practice strengthens memory pathways. Re-reading creates a "fluency illusion" — you feel you know it but can\\'t retrieve it under pressure.',
    bestFor: ['exam prep', 'reviewing lectures', 'consolidating learning'],
    engineConfig: { mode: 'recall', topicPrompt: 'What topic are you reviewing?', timerMode: true },
    pointsPerSession: 15, 
    discoveryBonus: 25 
  }
];

export const getRuleById = (id: string) => Object.freeze(RULES.find(r => r.id === id) || RULES[0]);
export const getRulesByCategory = (catId: CategoryId) => RULES.filter(r => r.categoryId === catId);
