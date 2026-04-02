mport { CategoryId } from './categories';

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
      { title: 'Find your gaps', prompt: 'Where did you struggle? What couldn\'t you explain? List the gaps.' },
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
    engineConfig: { sortMode: 'frog', prompt: 'What is your most important task today? The one you\'ve been avoiding.' },
    pointsPerSession: 15, 
    discoveryBonus: 25 
  },
  { 
    id: 'two_minute', 
    name: '2-Minute Rule', 
    categoryId: 'productivity',
    engine: 'countdown',
    shortDescription: 'If it takes 2 minutes, do it right now',
    description: 'If a task takes less than 2 minutes to complete, do it immediately. Don\'t schedule it, don\'t write it down — just do it.',
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
    whyItWorks: 'Retrieval practice strengthens memory pathways. Re-reading creates a "fluency illusion" — you feel you know it but can\'t retrieve it under pressure.',
    bestFor: ['exam prep', 'reviewing lectures', 'consolidating learning'],
    engineConfig: { mode: 'recall', topicPrompt: 'What topic are you reviewing?', timerMode: true },
    pointsPerSession: 15, 
    discoveryBonus: 25 
  },
  { 
    id: 'cornell_notes', 
    name: 'Cornell Note-Taking', 
    categoryId: 'study',
    engine: 'guided',
    shortDescription: 'Divide page into notes, cues, and summary sections',
    description: 'Divide your page into three sections: notes (right), cues/questions (left), summary (bottom). During a lecture, fill the notes section. After, add questions in the cues column. Finally, summarize the key points at the bottom.',
    whyItWorks: 'The structure forces active engagement with material. Adding questions after the lecture enhances retrieval practice. Regular review of the summary section beats cramming.',
    bestFor: ['lectures', 'textbook reading', 'fact-heavy subjects'],
    engineConfig: { sections: ['notes', 'cues', 'summary'], reviewPrompt: 'Ready to review your notes?' },
    pointsPerSession: 15,
    discoveryBonus: 25
  },
  { 
    id: 'sq3r', 
    name: 'SQ3R Method', 
    categoryId: 'learning',
    engine: 'guided',
    shortDescription: 'Survey-Question-Read-Recite-Review approach',
    description: 'Five-step reading method: (1) Survey the text (skim headings), (2) generate Questions from headings, (3) Read actively, (4) Recite answers aloud, (5) Review periodically.',
    whyItWorks: 'Engaging with material at five different levels encodes it deeper. Self-questions create a framework for understanding, and recitation activates memory.',
    bestFor: ['textbooks', 'articles', 'research papers', 'dense reading'],
    engineConfig: { steps: ['survey', 'question', 'read', 'recite', 'review'], timerMode: true },
    pointsPerSession: 20,
    discoveryBonus: 25
  },
  { 
    id: 'mind_mapping', 
    name: 'Mind Mapping', 
    categoryId: 'learning',
    engine: 'guided',
    shortDescription: 'Visually connect ideas radiating from a central topic',
    description: 'Start with a central idea. Branch out with related subtopics. Add details to each branch. Use colours, icons, and visuals. Review and refine regularly. Excellent for brainstorming and organizing complex topics.',
    whyItWorks: 'Visual-spatial organization mirrors how the brain naturally links concepts. Colours and images improve memory encoding and recall speed.',
    bestFor: ['brainstorming', 'complex topics', 'project planning', 'creative thinking'],
    engineConfig: { centralPrompt: 'What is your central topic or idea?', maxBranches: 5, allowImages: true },
    pointsPerSession: 15,
    discoveryBonus: 25
  },
  { 
    id: 'elaborative_interrogation', 
    name: 'Elaborative Interrogation', 
    categoryId: 'learning',
    engine: 'guided',
    shortDescription: 'Ask "why" and "how" repeatedly about what you\'re learning',
    description: 'For each piece of information, ask "Why is this true?" and "How does this relate to what I already know?" Write out your explanations. This technique forces deep processing.',
    whyItWorks: 'Generating explanations creates stronger semantic links to existing knowledge. Deep processing creates retrieval cues that improve long-term memory.',
    bestFor: ['understanding concepts', 'exam preparation', 'critical thinking'],
    engineConfig: { prompt: 'What are you learning about?', questionTypes: ['why', 'how'], iterations: 3 },
    pointsPerSession: 15,
    discoveryBonus: 25
  },
  { 
    id: '1_3_5', 
    name: '1-3-5 Rule', 
    categoryId: 'productivity',
    engine: 'sorter',
    shortDescription: '1 big task, 3 medium tasks, 5 small tasks per day',
    description: 'Each day, plan exactly 1 big goal, 3 medium goals, and 5 small goals. This creates structure without overwhelming yourself. Most people vastly overestimate what they can do in a day.',
    whyItWorks: 'Realistic daily targets prevent decision fatigue and burnout. The mix of sizes ensures both short-term wins and progress on long-term goals.',
    bestFor: ['daily planning', 'avoiding overcommitment', 'balanced productivity'],
    engineConfig: { bigSlots: 1, mediumSlots: 3, smallSlots: 5, prompt: 'What\'s your one big goal for today?' },
    pointsPerSession: 10,
    discoveryBonus: 25
  },
  { 
    id: '80_20', 
    name: '80/20 Rule (Pareto Principle)', 
    categoryId: 'productivity',
    engine: 'sorter',
    shortDescription: '80% of results come from 20% of efforts',
    description: 'Identify which 20% of your efforts produce 80% of your results. Focus ruthlessly on high-impact tasks. Eliminate, delegate, or batch low-impact activities.',
    whyItWorks: 'Most outcomes cluster in a small number of high-leverage activities. Strategic focus multiplies productivity far beyond marginal effort increases.',
    bestFor: ['time management', 'prioritization', 'strategic planning'],
    engineConfig: { sortMode: '80_20', prompt: 'What are your top 20% high-impact activities?' },
    pointsPerSession: 10,
    discoveryBonus: 25
  },
  { 
    id: 'parkinsons_law', 
    name: 'Parkinson\'s Law', 
    categoryId: 'productivity',
    engine: 'awareness',
    shortDescription: 'Work expands to fill the time allowed; set tight deadlines',
    description: 'Tasks take as long as the time allocated to them. If you give yourself 2 weeks for a task, it will take 2 weeks. Set specific, tight deadlines to force efficiency.',
    whyItWorks: 'External time pressure activates focus and eliminates perfectionism. Without deadlines, work sprawls and procrastination wins.',
    bestFor: ['overcoming perfectionism', 'time management', 'breaking procrastination'],
    engineConfig: { defaultDeadlineMinutes: 25, allowCustomDeadline: true },
    pointsPerSession: 10,
    discoveryBonus: 25
  },
  { 
    id: '5_second_rule', 
    name: '5-Second Rule', 
    categoryId: 'productivity',
    engine: 'awareness',
    shortDescription: 'Count down 5-4-3-2-1 and do it before hesitation kicks in',
    description: 'When you identify something that scares you or you\'re procrastinating on, count down from 5. At "1," take action immediately. Bypasses the brain\'s resistance.',
    whyItWorks: 'Self-doubt and hesitation build in the first 5 seconds. Immediate action prevents the amygdala from activating the fear response. Builds action-first habits.',
    bestFor: ['overcoming anxiety', 'stopping procrastination', 'building confidence'],
    engineConfig: { countdownSeconds: 5, actionPrompt: 'What are you avoiding?' },
    pointsPerSession: 5,
    discoveryBonus: 25
  },
  { 
    id: 'blurting', 
    name: 'Blurting', 
    categoryId: 'study',
    engine: 'freewrite',
    shortDescription: 'Write everything you remember without stopping or checking',
    description: 'Set a timer and write everything you remember about a topic without pausing, checking notes, or editing. Speed and completeness matter, not accuracy.',
    whyItWorks: 'Blurting reveals what you truly know (vs. fluency gains). Unfiltered output shows memory gaps. Doing it repeatedly strengthens retrieval pathways.',
    bestFor: ['exam preparation', 'memory training', 'testing knowledge'],
    engineConfig: { timerMinutes: 10, allowEdits: false, checkAfter: true },
    pointsPerSession: 10,
    discoveryBonus: 25
  },
  { 
    id: 'chunking', 
    name: 'Chunking', 
    categoryId: 'learning',
    engine: 'guided',
    shortDescription: 'Group information into meaningful chunks for better memory',
    description: 'Break large amounts of information into smaller, meaningful groups. For example, remember 1-8-0-0-3-6 not as 6 digits but as 1-80-03-6 (a year, a temperature, an area code).',
    whyItWorks: 'Working memory can hold 7±2 chunks. Grouping information into meaningful patterns dramatically increases capacity and recall speed.',
    bestFor: ['memorizing numbers', 'organizing information', 'language learning'],
    engineConfig: { prompt: 'What information are you trying to remember?', maxChunkSize: 4 },
    pointsPerSession: 10,
    discoveryBonus: 25
  },
  { 
    id: 'interleaving', 
    name: 'Interleaving', 
    categoryId: 'study',
    engine: 'guided',
    shortDescription: 'Mix different problems/topics during practice, not blocked',
    description: 'Instead of practicing math topic A for 1 hour, then topic B for 1 hour, randomly interleave them: A, B, A, C, B, A. Feels harder. It IS harder. That\'s the point.',
    whyItWorks: 'Interleaving forces the brain to distinguish between problem types and apply the right strategy. Blocked practice creates false fluency (you forget which strategy to use in exams).',
    bestFor: ['math', 'problem-solving', 'skill acquisition', 'pattern recognition'],
    engineConfig: { mixMode: 'random', topics: [], prompt: 'What topics are you practicing?' },
    pointsPerSession: 15,
    discoveryBonus: 25
  },
  { 
    id: '1_4_7', 
    name: '1-4-7 Spacing Rule', 
    categoryId: 'learning',
    engine: 'spaced',
    shortDescription: 'Review the same day, 4 days later, 7 days later',
    description: 'Review new material today, again in 4 days, and once more in 7 days. This specific schedule balances frequency and spacing for optimal memory consolidation.',
    whyItWorks: 'This schedule aligns with the forgetting curve. Each review happens just before you\'d forget, maximizing memory strength without wasted repetitions.',
    bestFor: ['language learning', 'vocabulary', 'facts and definitions'],
    engineConfig: { intervals: [0, 4, 7], notifyAt: '10:00' },
    pointsPerSession: 15,
    discoveryBonus: 25
  }
];

export const getRuleById = (id: string) => Object.freeze(RULES.find(r => r.id === id) || RULES[0]);
export const getRulesByCategory = (catId: CategoryId) => RULES.filter(r => r.categoryId === catId);

