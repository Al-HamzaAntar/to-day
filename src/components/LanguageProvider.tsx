
import React, { createContext, useContext, useState, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    "app.title": "Daily Time Tracker",
    "app.description": "Plan and track how you spend your time each day",
    "tabs.plan": "Plan",
    "tabs.track": "Track",
    "tabs.analyze": "Analyze",
    
    "taskAllocation.title": "Allocate Your 24 Hours",
    "taskAllocation.taskName": "Task Name",
    "taskAllocation.hours": "Hours",
    "taskAllocation.minutes": "Minutes",
    "taskAllocation.addTask": "Add Task",
    "taskAllocation.timeLeft": "Time left in day:",
    "taskAllocation.exceededBy": "Exceeded by",
    "taskAllocation.yourTasks": "Your Tasks",
    
    "taskTracker.title": "Track Your Time",
    "taskTracker.hours": "Hours",
    "taskTracker.minutes": "Minutes",
    "taskTracker.saveTime": "Save Time",
    "taskTracker.plan": "Plan:",
    "taskTracker.actual": "Actual time:",
    "taskTracker.remaining": "Remaining:",
    "taskTracker.trackTime": "Track Time",
    "taskTracker.updateTime": "Update Time",
    "taskTracker.notTracked": "Not tracked",
    "taskTracker.exceedsPlannedTime": "Actual time cannot exceed planned time",
    "taskTracker.noTasks": "No tasks to track. Start by planning your day.",
    
    "analysis.title": "Task Analysis",
    "analysis.day": "Day",
    "analysis.week": "Week",
    "analysis.month": "Month",
    "analysis.pie": "Pie",
    "analysis.bar": "Bar",
    "analysis.noData": "No data available for analysis. Start tracking your tasks to see insights.",
    "analysis.totalTime": "Total Time Tracked",
    "analysis.of": "of",
    "analysis.planned": "planned",
    "analysis.mostEfficient": "Most Efficient Task",
    "analysis.leastEfficient": "Least Efficient Task",
    "analysis.efficient": "efficient",
    "analysis.taskDetails": "Task Details",
    "analysis.occurrences": "occurrences",
    "analysis.actual": "Actual",
    "analysis.efficiency": "Efficiency",

    "dashboard.tasksPlanned": "Tasks Planned",
    "dashboard.tasksTracked": "Tasks Tracked",
    "dashboard.planned": "planned",
    "dashboard.tracked": "tracked",
    "dashboard.completion": "Completion",
    
    "time.allocation": "Time Allocation",
    "time.used": "Used:",
    "time.remaining": "Remaining:",
    "time.total": "Total:",
    "time.completion": "Completion",
    "time.breakdown": "Task Breakdown",
    
    "timeDisplay.planned": "Planned",
    "timeDisplay.tracked": "Tracked",
    "timeDisplay.remaining": "Remaining",
    
    "reset.title": "Clear All Data",
    "reset.description": "This will reset all your tasks for today. This action cannot be undone.",
    "reset.cancel": "Cancel",
    "reset.confirm": "Clear Data",
    
    "toast.taskAdded": "Task added successfully",
    "toast.taskRemoved": "Task removed",
    "toast.timeUpdated": "Time updated",
    "toast.dataCleared": "All data cleared",
    "toast.error.emptyName": "Task name cannot be empty",
    "toast.error.zeroDuration": "Time must be greater than zero",
    "toast.error.exceed24": "Total planned time cannot exceed 24 hours",
    
    "export.button": "Export",
    "export.title": "Export Data",
    "export.copy": "Copy to Clipboard",
    "export.download": "Download as JSON",
    "export.success": "Copied to clipboard!",
    
    "dailyReminder.title": "Plan Your Day",
    "dailyReminder.description": "It's a new day! Time to plan your activities.",
    "dailyReminder.prompt": "Would you like to allocate your tasks for today?",
    "dailyReminder.later": "Remind Me Later",
    "dailyReminder.planNow": "Plan Now",
    "dailyReminder.startPlanning": "Start by adding tasks to your day"
  },
  ar: {
    "app.title": "متتبع الوقت اليومي",
    "app.description": "خطط وتتبع كيف تقضي وقتك كل يوم",
    "tabs.plan": "خطة",
    "tabs.track": "تتبع",
    "tabs.analyze": "تحليل",
    
    "taskAllocation.title": "توزيع ٢٤ ساعة",
    "taskAllocation.taskName": "اسم المهمة",
    "taskAllocation.hours": "ساعات",
    "taskAllocation.minutes": "دقائق",
    "taskAllocation.addTask": "إضافة مهمة",
    "taskAllocation.timeLeft": "الوقت المتبقي في اليوم:",
    "taskAllocation.exceededBy": "تجاوز بمقدار",
    "taskAllocation.yourTasks": "مهامك",
    
    "taskTracker.title": "تتبع وقتك",
    "taskTracker.hours": "ساعات",
    "taskTracker.minutes": "دقائق",
    "taskTracker.saveTime": "حفظ الوقت",
    "taskTracker.plan": "خطة:",
    "taskTracker.actual": "الوقت الفعلي:",
    "taskTracker.remaining": "متبقي:",
    "taskTracker.trackTime": "تتبع الوقت",
    "taskTracker.updateTime": "تحديث الوقت",
    "taskTracker.notTracked": "غير متتبع",
    "taskTracker.exceedsPlannedTime": "لا يمكن أن يتجاوز الوقت الفعلي الوقت المخطط له",
    "taskTracker.noTasks": "لا توجد مهام للتتبع. ابدأ بتخطيط يومك.",
    
    "analysis.title": "تحليل المهام",
    "analysis.day": "يوم",
    "analysis.week": "أسبوع",
    "analysis.month": "شهر",
    "analysis.pie": "دائري",
    "analysis.bar": "شريطي",
    "analysis.noData": "لا توجد بيانات متاحة للتحليل. ابدأ بتتبع مهامك لرؤية التحليلات.",
    "analysis.totalTime": "إجمالي الوقت المتتبع",
    "analysis.of": "من",
    "analysis.planned": "مخطط",
    "analysis.mostEfficient": "المهمة الأكثر كفاءة",
    "analysis.leastEfficient": "المهمة الأقل كفاءة",
    "analysis.efficient": "كفاءة",
    "analysis.taskDetails": "تفاصيل المهمة",
    "analysis.occurrences": "مرات",
    "analysis.actual": "فعلي",
    "analysis.efficiency": "الكفاءة",

    "dashboard.tasksPlanned": "المهام المخططة",
    "dashboard.tasksTracked": "المهام المتتبعة",
    "dashboard.planned": "مخطط",
    "dashboard.tracked": "متتبع",
    "dashboard.completion": "الإنجاز",
    
    "time.allocation": "توزيع الوقت",
    "time.used": "المستخدم:",
    "time.remaining": "المتبقي:",
    "time.total": "المجموع:",
    "time.completion": "الإنجاز",
    "time.breakdown": "تفاصيل المهام",
    
    "timeDisplay.planned": "مخطط",
    "timeDisplay.tracked": "متتبع",
    "timeDisplay.remaining": "متبقي",
    
    "reset.title": "مسح جميع البيانات",
    "reset.description": "سيؤدي هذا إلى إعادة تعيين جميع مهامك لليوم. لا يمكن التراجع عن هذا الإجراء.",
    "reset.cancel": "إلغاء",
    "reset.confirm": "مسح البيانات",
    
    "toast.taskAdded": "تمت إضافة المهمة بنجاح",
    "toast.taskRemoved": "تمت إزالة المهمة",
    "toast.timeUpdated": "تم تحديث الوقت",
    "toast.dataCleared": "تم مسح جميع البيانات",
    "toast.error.emptyName": "لا يمكن أن يكون اسم المهمة فارغًا",
    "toast.error.zeroDuration": "يجب أن يكون الوقت أكبر من صفر",
    "toast.error.exceed24": "لا يمكن أن يتجاوز إجمالي الوقت المخطط له 24 ساعة",
    
    "export.button": "تصدير",
    "export.title": "تصدير البيانات",
    "export.copy": "نسخ إلى الحافظة",
    "export.download": "تنزيل كـ JSON",
    "export.success": "تم النسخ إلى الحافظة!",
    
    "dailyReminder.title": "خطط ليومك",
    "dailyReminder.description": "إنه يوم جديد! حان الوقت لتخطيط أنشطتك.",
    "dailyReminder.prompt": "هل ترغب في توزيع مهامك لهذا اليوم؟",
    "dailyReminder.later": "ذكرني لاحقًا",
    "dailyReminder.planNow": "خطط الآن",
    "dailyReminder.startPlanning": "ابدأ بإضافة مهام ليومك"
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
