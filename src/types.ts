
export interface Command {
  id: string;
  title: string;
  source: 'AI Roadmap' | 'Skill Drill' | 'Book' | 'Reading' | 'Podcast' | 'Rule' | 'Intelligence' | 'Business Rotation' | 'Business Decode' | 'Review' | 'Carryover';
  timeWindow: 'Morning' | 'Afternoon' | 'Evening' | 'Review';
  duration: string;
  resource: string;
  priorityReason: string;
  impact: string;
  instructions: string;
  why: string;
  output: string;
}

export interface Skill {
  id: number;
  name: string;
  phase: number;
  book?: string;
  drill: string;
  milestone: string;
  resources: string[];
}

export interface Rule {
  id: number;
  rule: string;
  detail: string;
}

export interface Business {
  id: number;
  name: string;
  tier: number;
  teaches: string;
  source: string;
  learnedLink?: string;
}

export interface Archetype {
  name: string;
  howMoneyFlows: string;
  margin: string;
  examples: string[];
  yourVentures: string[];
}

export interface AIWeek {
  week: number;
  phase: string;
  title: string;
  summary: string;
  objectives: string[];
  resources: { type: string; name: string; why: string; url: string; hrs: string }[];
  project: { title: string; description: string; tags: string[] };
  checks: string[];
}

export interface HistoryEvent {
  id: string;
  timestamp: number;
  type: 'task_completed' | 'task_missed' | 'focus_session' | 'rule_logged' | 'reading_completed' | 'podcast_listened' | 'resource_consumed' | 'intelligence_signal_logged' | 'business_decoded' | 'skill_rep_completed' | 'week_completed' | 'carryover_created';
  title: string;
  source: string;
  notes?: string;
  focusTime?: number; // in minutes
  taskId?: string;
}

export interface OSState {
  date: string; // YYYY-MM-DD
  week: number;
  day: number;
  streak: number;
  history: HistoryEvent[];
  completedTasks: string[]; // IDs
  missedTasks: string[]; // IDs
  carryovers: Command[];
  ruleLogs: { [key: string]: number }; // ruleId: count or score
  businessDecodes: { [key: string]: any };
  readingProgress: { [key: string]: boolean };
  podcastListened: string[];
  intelligenceSignals: any[];
  skillReps: { [key: number]: number };
  settings: {
    startDate: string;
  };
}
