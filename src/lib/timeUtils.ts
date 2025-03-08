
import { Task, TimeAllocation, AnalysisPeriod, TaskAnalytics } from "../types";

export const formatTime = (hours: number, minutes: number): string => {
  const formattedHours = hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  return `${formattedHours}h ${formattedMinutes}m`;
};

export const formatTimeArabic = (hours: number, minutes: number): string => {
  const formattedHours = hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  return `${formattedHours}س ${formattedMinutes}د`;
};

export const calculateTotalTime = (tasks: Task[]): TimeAllocation => {
  const totalMinutes = tasks.reduce((total, task) => {
    const taskMinutes = (task.plannedHours * 60) + (task.plannedMinutes || 0);
    return total + taskMinutes;
  }, 0);

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
};

export const calculateActualTotalTime = (tasks: Task[]): TimeAllocation => {
  const totalMinutes = tasks.reduce((total, task) => {
    if (task.actualHours === null || task.actualMinutes === null) return total;
    const taskMinutes = (task.actualHours * 60) + task.actualMinutes;
    return total + taskMinutes;
  }, 0);

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
};

export const calculateRemainingTime = (task: Task): TimeAllocation => {
  if (task.actualHours === null || task.actualMinutes === null) {
    return {
      hours: task.plannedHours,
      minutes: task.plannedMinutes
    };
  }

  const plannedMinutes = (task.plannedHours * 60) + task.plannedMinutes;
  const actualMinutes = (task.actualHours * 60) + task.actualMinutes;
  const remainingMinutes = Math.max(0, plannedMinutes - actualMinutes);

  return {
    hours: Math.floor(remainingMinutes / 60),
    minutes: remainingMinutes % 60
  };
};

export const getRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
};

export const timeInMinutes = (hours: number, minutes: number): number => {
  return (hours * 60) + minutes;
};

export const minutesToTimeAllocation = (totalMinutes: number): TimeAllocation => {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
};

export const validateTotalTime = (tasks: Task[]): boolean => {
  const totalTime = calculateTotalTime(tasks);
  return (totalTime.hours < 24) || (totalTime.hours === 24 && totalTime.minutes === 0);
};

// New functions for analysis

export const getStartOfWeek = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = newDate.getDate() - day; // adjust when day is Sunday
  return new Date(newDate.setDate(diff));
};

export const getStartOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const saveTasksHistory = (tasks: Task[]): void => {
  // Don't save if no tasks with actual time
  if (!tasks.some(task => task.actualHours !== null)) return;
  
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const tasksWithDate = {
    date,
    tasks: tasks.map(task => ({...task}))
  };
  
  // Load existing history
  const history = JSON.parse(localStorage.getItem('tasks-history') || '[]');
  
  // Check if we already have an entry for today
  const existingIndex = history.findIndex((item: any) => item.date === date);
  
  if (existingIndex >= 0) {
    // Update today's entry
    history[existingIndex] = tasksWithDate;
  } else {
    // Add new entry
    history.push(tasksWithDate);
  }
  
  // Save back to localStorage
  localStorage.setItem('tasks-history', JSON.stringify(history));
};

export const getTasksHistory = (): { date: string; tasks: Task[] }[] => {
  return JSON.parse(localStorage.getItem('tasks-history') || '[]');
};

export const getAnalyticsData = (period: AnalysisPeriod): TaskAnalytics[] => {
  const history = getTasksHistory();
  if (history.length === 0) return [];
  
  // Group tasks by name across all dates
  const tasksByName: Record<string, { planned: number, actual: number, occurrences: number }> = {};
  
  // Filter history based on period
  const filteredHistory = history.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    
    if (period === 'week') {
      const startOfWeek = getStartOfWeek();
      return entryDate >= startOfWeek;
    } else if (period === 'month') {
      const startOfMonth = getStartOfMonth();
      return entryDate >= startOfMonth;
    }
    
    return true; // Default case (all)
  });
  
  filteredHistory.forEach(dayData => {
    dayData.tasks.forEach(task => {
      if (!tasksByName[task.name]) {
        tasksByName[task.name] = { planned: 0, actual: 0, occurrences: 0 };
      }
      
      // Add to planned time
      tasksByName[task.name].planned += (task.plannedHours * 60) + task.plannedMinutes;
      
      // Add to actual time if tracked
      if (task.actualHours !== null && task.actualMinutes !== null) {
        tasksByName[task.name].actual += (task.actualHours * 60) + task.actualMinutes;
        tasksByName[task.name].occurrences += 1;
      }
    });
  });
  
  // Convert to array format for charts
  const result: TaskAnalytics[] = Object.entries(tasksByName).map(([name, data]) => {
    const efficiency = data.actual > 0 ? Math.min(100, (data.actual / data.planned) * 100) : 0;
    
    return {
      name,
      planned: minutesToTimeAllocation(data.planned),
      actual: minutesToTimeAllocation(data.actual),
      plannedMinutes: data.planned,
      actualMinutes: data.actual,
      occurrences: data.occurrences,
      efficiency
    };
  });
  
  // Sort by planned time (descending)
  return result.sort((a, b) => b.plannedMinutes - a.plannedMinutes);
};
