
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
