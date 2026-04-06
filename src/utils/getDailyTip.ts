const TIPS = [
  "Looking 20 feet away for 20 seconds every 20 minutes reduces eye strain by 40%.",
  "The 'Eat the Frog' technique ensures your most important task gets done first.",
  "Working in 90-minute ultradian cycles aligns with your brain's natural energy peaks.",
  "Explaining a concept to a child (Feynman Technique) reveals hidden gaps in your knowledge.",
  "Active recall is 50-100% more effective than passive re-reading for long-term memory.",
  "A simple 2-minute task should be done immediately to reduce 'backlog anxiety'.",
  "Spaced repetition leverages the forgetting curve to strengthen memory with less effort.",
  "The 5-second rule bypasses your brain's natural hesitation for difficult tasks.",
  "Parkinson's Law: Setting tighter deadlines actually increases your creative focus.",
  "Interleaving different study topics forces your brain to build stronger retrieval cues."
];

export function getDailyTip(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return TIPS[dayOfYear % TIPS.length];
}
