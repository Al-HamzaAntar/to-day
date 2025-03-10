
import { Task } from "@/types";
import { formatTime } from "./timeUtils";
import { toLocaleDigits } from "./formatUtils";

// Function to export tasks data to CSV
export const exportToCSV = (tasks: Task[]) => {
  // Detect language preference from localStorage
  const currentLang = localStorage.getItem('app-language') || 'en';
  const isArabic = currentLang === 'ar';
  
  // Set headers based on language
  const headers = isArabic 
    ? ["اسم المهمة", "الوقت المخطط", "الوقت الفعلي", "نسبة الإكمال %"]
    : ["Task Name", "Planned Time", "Actual Time", "Completion %"];
  
  // Create rows for each task
  const rows = tasks.map(task => {
    const plannedTime = formatTime(task.plannedHours, task.plannedMinutes);
    const actualTime = task.actualHours !== null ? 
      formatTime(task.actualHours, task.actualMinutes || 0) : 
      isArabic ? "غير متتبع" : "Not tracked";
    
    // Calculate completion percentage
    const isCompleted = task.actualHours !== null && task.actualMinutes !== null;
    const completionStatus = isCompleted ? 
      isArabic ? toLocaleDigits("100%", isArabic) : "100%" : 
      isArabic ? toLocaleDigits("0%", isArabic) : "0%";
    
    return [
      task.name,
      isArabic ? toLocaleDigits(plannedTime, isArabic) : plannedTime,
      isArabic ? (isCompleted ? toLocaleDigits(actualTime, isArabic) : "غير متتبع") : actualTime,
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
  
  const today = new Date().toISOString().split('T')[0];
  const filename = isArabic ? `مهام_${today}.csv` : `tasks_export_${today}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to export tasks data to Excel (XLSX)
export const exportToExcel = (tasks: Task[]) => {
  // Detect language preference from localStorage
  const currentLang = localStorage.getItem('app-language') || 'en';
  const isArabic = currentLang === 'ar';
  
  // Set headers based on language
  const headers = isArabic 
    ? ["اسم المهمة", "الوقت المخطط", "الوقت الفعلي", "نسبة الإكمال %"]
    : ["Task Name", "Planned Time", "Actual Time", "Completion %"];
  
  // Create rows for each task
  const rows = tasks.map(task => {
    const plannedTime = formatTime(task.plannedHours, task.plannedMinutes);
    const actualTime = task.actualHours !== null ? 
      formatTime(task.actualHours, task.actualMinutes || 0) : 
      isArabic ? "غير متتبع" : "Not tracked";
    
    // Calculate completion percentage
    const isCompleted = task.actualHours !== null && task.actualMinutes !== null;
    const completionStatus = isCompleted ? 
      isArabic ? toLocaleDigits("100%", isArabic) : "100%" : 
      isArabic ? toLocaleDigits("0%", isArabic) : "0%";
    
    return [
      task.name,
      isArabic ? toLocaleDigits(plannedTime, isArabic) : plannedTime,
      isArabic ? (isCompleted ? toLocaleDigits(actualTime, isArabic) : "غير متتبع") : actualTime,
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
  
  const today = new Date().toISOString().split('T')[0];
  const filename = isArabic ? `مهام_${today}.xlsx` : `tasks_export_${today}.xlsx`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
