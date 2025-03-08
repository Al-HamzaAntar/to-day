
import { Task } from "@/types";
import { formatTime } from "./timeUtils";

// Function to export tasks data to CSV
export const exportToCSV = (tasks: Task[]) => {
  // Create CSV headers
  const headers = ["Task Name", "Planned Time", "Actual Time", "Completion %"];
  
  // Create rows for each task
  const rows = tasks.map(task => {
    const plannedTime = formatTime(task.plannedHours, task.plannedMinutes);
    const actualTime = task.actualHours !== null ? 
      formatTime(task.actualHours, task.actualMinutes || 0) : 
      "Not tracked";
    
    // Calculate completion percentage
    const isCompleted = task.actualHours !== null && task.actualMinutes !== null;
    const completionStatus = isCompleted ? "100%" : "0%";
    
    return [
      task.name,
      plannedTime,
      actualTime,
      completionStatus
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  // Create a Blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to export tasks data to Excel (XLSX)
export const exportToExcel = (tasks: Task[]) => {
  // For Excel export, we'll use CSV format with .xlsx extension
  // In a production app, you might want to use a proper Excel library
  // Create CSV headers
  const headers = ["Task Name", "Planned Time", "Actual Time", "Completion %"];
  
  // Create rows for each task
  const rows = tasks.map(task => {
    const plannedTime = formatTime(task.plannedHours, task.plannedMinutes);
    const actualTime = task.actualHours !== null ? 
      formatTime(task.actualHours, task.actualMinutes || 0) : 
      "Not tracked";
    
    // Calculate completion percentage
    const isCompleted = task.actualHours !== null && task.actualMinutes !== null;
    const completionStatus = isCompleted ? "100%" : "0%";
    
    return [
      task.name,
      plannedTime,
      actualTime,
      completionStatus
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  // Create a Blob and download
  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
