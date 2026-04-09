export const XP_LEVELS = [
  { min: 0, name: 'Getting Started' },
  { min: 100, name: 'Building Momentum' },
  { min: 250, name: 'In the Zone' },
  { min: 500, name: 'Rule Master' },
  { min: 1000, name: 'Productively Positive' },
];

export const XP_THRESHOLDS = {
  CATALYST: 500,
  LEGEND: 1000,
};

export const SESSION_THRESHOLDS = {
  MIN_PERCENTAGE_FOR_XP: 0.3, // Must complete 30% of target time
  MIN_SECONDS_FOR_STOPWATCH: 120, // Must do at least 2 mins for point-less rules
};

export const getLevelName = (score: number) => {
  const level = [...XP_LEVELS].reverse().find((l) => score >= l.min);
  return level ? level.name : XP_LEVELS[0].name;
};
