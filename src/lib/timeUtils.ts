
import { Task, TaskAnalytics, TimeAllocation, AnalysisPeriod } from "@/types";

export const calculateTotalTime = (tasks: Task[]) => {
  const totalMinutes = tasks.reduce((sum, task) => {
    return sum + task.plannedHours * 60 + task.plannedMinutes;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
};

export const calculateActualTotalTime = (tasks: Task[]) => {
  const totalMinutes = tasks.reduce((sum, task) => {
    const actualHours = task.actualHours !== null ? task.actualHours : 0;
    const actualMinutes = task.actualMinutes !== null ? task.actualMinutes : 0;
    return sum + actualHours * 60 + actualMinutes;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
};

// Helper to generate random color
export const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

// Validate if total time exceeds 24 hours
export const validateTotalTime = (tasks: Task[]) => {
  const totalTime = calculateTotalTime(tasks);
  const totalMinutes = totalTime.hours * 60 + totalTime.minutes;
  return totalMinutes <= 24 * 60; // 24 hours in minutes
};

// Save tasks history
export const saveTasksHistory = (tasks: Task[]) => {
  if (!tasks.length) return;
  
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Get existing history
  const historyStr = localStorage.getItem('to-day-history');
  const history = historyStr ? JSON.parse(historyStr) : {};
  
  // Only save tasks with actual time
  const tasksWithTime = tasks.filter(task => 
    task.actualHours !== null && task.actualMinutes !== null
  );
  
  if (tasksWithTime.length === 0) return;
  
  // Update history with today's tasks
  history[date] = tasksWithTime;
  
  // Save back to localStorage
  localStorage.setItem('to-day-history', JSON.stringify(history));
};

export const getTasksHistory = () => {
  const historyStr = localStorage.getItem('to-day-history');
  return historyStr ? JSON.parse(historyStr) : {};
};

// Function to calculate time in minutes
export const timeInMinutes = (hours: number, minutes: number) => {
  return hours * 60 + minutes;
};

// Calculate remaining time for a task
export const calculateRemainingTime = (task: Task) => {
  if (task.actualHours === null || task.actualMinutes === null) {
    return { hours: task.plannedHours, minutes: task.plannedMinutes };
  }

  const plannedMinutes = task.plannedHours * 60 + task.plannedMinutes;
  const actualMinutes = task.actualHours * 60 + task.actualMinutes;
  const remainingMinutes = Math.max(0, plannedMinutes - actualMinutes);

  return {
    hours: Math.floor(remainingMinutes / 60),
    minutes: remainingMinutes % 60
  };
};

// Format time display
export const formatTime = (hours: number, minutes: number, isArabic: boolean = false) => {
  const formattedHours = hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  
  if (isArabic) {
    return `${toArabicDigits(formattedHours)}س ${toArabicDigits(formattedMinutes)}د`;
  }
  
  return `${formattedHours}h ${formattedMinutes}m`;
};

// Convert to Arabic digits
export const toArabicDigits = (str: string) => {
  return str.replace(/\d/g, d => 
    String.fromCharCode(1632 + parseInt(d, 10))
  );
};

// Format date
export const formatDate = (date: Date, isArabic: boolean = false) => {
  if (isArabic) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('ar-SA', options).format(date);
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get start of day
export const getStartOfDay = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Get start of week
export const getStartOfWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek; // adjust when day is sunday
  return new Date(now.setDate(diff));
};

// Get start of month
export const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// Get analytics data from task history
export const getAnalyticsData = (period: AnalysisPeriod): TaskAnalytics[] => {
  const history = getTasksHistory();
  const result: { [key: string]: TaskAnalytics } = {};
  
  // Process tasks based on the selected period
  const startDate = getStartDate(period);
  
  // Filter history entries by date
  Object.entries(history).forEach(([dateStr, tasks]) => {
    const date = new Date(dateStr);
    if (date >= startDate) {
      // Process tasks for this date
      (tasks as Task[]).forEach(task => {
        if (task.actualHours === null || task.actualMinutes === null) return;
        
        if (!result[task.name]) {
          result[task.name] = {
            name: task.name,
            planned: { hours: 0, minutes: 0 },
            actual: { hours: 0, minutes: 0 },
            plannedMinutes: 0,
            actualMinutes: 0,
            occurrences: 0,
            efficiency: 0
          };
        }
        
        // Sum up planned and actual time
        result[task.name].plannedMinutes += task.plannedHours * 60 + task.plannedMinutes;
        result[task.name].actualMinutes += task.actualHours * 60 + task.actualMinutes;
        result[task.name].occurrences += 1;
      });
    }
  });
  
  // Calculate hours and minutes and efficiency
  Object.values(result).forEach(analytics => {
    analytics.planned = {
      hours: Math.floor(analytics.plannedMinutes / 60),
      minutes: analytics.plannedMinutes % 60
    };
    
    analytics.actual = {
      hours: Math.floor(analytics.actualMinutes / 60),
      minutes: analytics.actualMinutes % 60
    };
    
    analytics.efficiency = analytics.plannedMinutes > 0
      ? Math.min(100, (analytics.actualMinutes / analytics.plannedMinutes) * 100)
      : 0;
  });
  
  return Object.values(result);
};

// Helper function to get start date based on period
function getStartDate(period: AnalysisPeriod): Date {
  switch (period) {
    case 'day':
      return getStartOfDay();
    case 'week':
      return getStartOfWeek();
    case 'month':
      return getStartOfMonth();
    case 'all':
      return new Date(0); // Beginning of time
    default:
      return getStartOfDay();
  }
}
