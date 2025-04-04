import { Task } from "@/types";

export const calculateTotalTime = (tasks: Task[]) => {
  const totalMinutes = tasks.reduce((sum, task) => {
    return sum + task.hours * 60 + task.minutes;
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

// Update the localStorage key to match the new app name
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
