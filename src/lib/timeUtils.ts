
import { Task, TimeAllocation } from "../types";

export const formatTime = (hours: number, minutes: number): string => {
  const formattedHours = hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  return `${formattedHours}h ${formattedMinutes}m`;
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
