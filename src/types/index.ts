
export interface Task {
  id: string;
  name: string;
  plannedHours: number;
  plannedMinutes: number;
  actualHours: number | null;
  actualMinutes: number | null;
  color: string;
}

export interface TimeAllocation {
  hours: number;
  minutes: number;
}

export type TimeUnit = 'hours' | 'minutes';

export type AnalysisPeriod = 'day' | 'week' | 'month' | 'all';

export interface TaskAnalytics {
  name: string;
  planned: TimeAllocation;
  actual: TimeAllocation;
  plannedMinutes: number;
  actualMinutes: number;
  occurrences: number;
  efficiency: number;
}
