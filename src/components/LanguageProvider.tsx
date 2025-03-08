
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation resources
const resources = {
  en: {
    // Page title and description
    "app.title": "Today",
    "app.description": "Plan and track your 24 hours with simplicity",
    
    // Time allocation
    "time.allocation": "Time Allocation",
    "time.used": "Used:",
    "time.remaining": "Remaining:",
    "time.total": "Total:",
    "time.breakdown": "Task Breakdown",
    "time.completion": "Completion",
    
    // Dashboard
    "dashboard.tasksPlanned": "Tasks Planned",
    "dashboard.tasksTracked": "Tasks Tracked",
    "dashboard.completion": "Completion",
    "dashboard.planned": "planned",
    "dashboard.tracked": "tracked",
    
    // Tabs
    "tabs.plan": "Plan Your Day",
    "tabs.track": "Track Your Time",
    "tabs.analyze": "Analytics",
    
    // Task allocation
    "taskAllocation.title": "Allocate Your 24 Hours",
    "taskAllocation.taskName": "Task Name",
    "taskAllocation.hours": "Hours",
    "taskAllocation.minutes": "Minutes",
    "taskAllocation.addTask": "Add Task",
    "taskAllocation.timeLeft": "Time Left:",
    "taskAllocation.exceededBy": "Exceeded by",
    "taskAllocation.yourTasks": "Your Tasks",
    
    // Task tracker
    "taskTracker.title": "Track Your Actual Time",
    "taskTracker.noTasks": "Add tasks to start tracking your time",
    "taskTracker.plan": "Plan:",
    "taskTracker.actual": "Actual:",
    "taskTracker.remaining": "Remaining:",
    "taskTracker.hours": "Hours",
    "taskTracker.minutes": "Minutes",
    "taskTracker.saveTime": "Save Time",
    "taskTracker.addTime": "Add Time",
    "taskTracker.currentTotal": "Current Total:",
    "taskTracker.notTracked": "Not tracked yet",
    "taskTracker.updateTime": "Update Time",
    "taskTracker.trackTime": "Track Time",
    "taskTracker.exceedsPlannedTime": "Time exceeds what was planned",
    
    // Analytics
    "analysis.title": "Task Analytics",
    "analysis.week": "This Week",
    "analysis.month": "This Month",
    "analysis.pie": "Pie",
    "analysis.bar": "Bar",
    "analysis.noData": "No data available yet. Complete some tasks to see analytics.",
    "analysis.totalTime": "Total Time Spent",
    "analysis.of": "of",
    "analysis.planned": "planned",
    "analysis.actual": "actual",
    "analysis.efficiency": "Efficiency",
    "analysis.efficient": "efficient",
    "analysis.taskDetails": "Task Details",
    "analysis.mostEfficient": "Most Efficient Task",
    "analysis.leastEfficient": "Least Efficient Task",
    "analysis.occurrences": "occurrences",
    
    // Reset dialog
    "reset.title": "Reset All Data",
    "reset.description": "This will clear all your tasks and history. This action cannot be undone.",
    "reset.cancel": "Cancel",
    "reset.confirm": "Yes, Reset",
    
    // Toasts
    "toast.taskAdded": "Task added successfully!",
    "toast.taskRemoved": "Task removed successfully!",
    "toast.timeUpdated": "Time updated successfully!",
    "toast.dataCleared": "All data cleared successfully!",
    "toast.error.emptyName": "Task name cannot be empty",
    "toast.error.zeroDuration": "Task duration must be greater than 0",
    "toast.error.exceed24": "Total time cannot exceed 24 hours",
  },
  ar: {
    // Page title and description
    "app.title": "اليوم",
    "app.description": "خطط وتتبع 24 ساعة بكل بساطة",
    
    // Time allocation
    "time.allocation": "توزيع الوقت",
    "time.used": "مستخدم:",
    "time.remaining": "متبقي:",
    "time.total": "المجموع:",
    "time.breakdown": "تفاصيل المهام",
    "time.completion": "الإنجاز",
    
    // Dashboard
    "dashboard.tasksPlanned": "المهام المخططة",
    "dashboard.tasksTracked": "المهام المتتبعة",
    "dashboard.completion": "الإنجاز",
    "dashboard.planned": "مخطط",
    "dashboard.tracked": "متابع",
    
    // Tabs
    "tabs.plan": "خطط يومك",
    "tabs.track": "تتبع وقتك",
    "tabs.analyze": "التحليلات",
    
    // Task allocation
    "taskAllocation.title": "وزع 24 ساعة",
    "taskAllocation.taskName": "اسم المهمة",
    "taskAllocation.hours": "ساعات",
    "taskAllocation.minutes": "دقائق",
    "taskAllocation.addTask": "إضافة مهمة",
    "taskAllocation.timeLeft": "الوقت المتبقي:",
    "taskAllocation.exceededBy": "تجاوز بـ",
    "taskAllocation.yourTasks": "مهامك",
    
    // Task tracker
    "taskTracker.title": "تتبع وقتك الفعلي",
    "taskTracker.noTasks": "أضف مهام لبدء تتبع وقتك",
    "taskTracker.plan": "الخطة:",
    "taskTracker.actual": "الفعلي:",
    "taskTracker.remaining": "المتبقي:",
    "taskTracker.hours": "ساعات",
    "taskTracker.minutes": "دقائق",
    "taskTracker.saveTime": "حفظ الوقت",
    "taskTracker.addTime": "إضافة وقت",
    "taskTracker.currentTotal": "المجموع الحالي:",
    "taskTracker.notTracked": "لم يتم التتبع بعد",
    "taskTracker.updateTime": "تحديث الوقت",
    "taskTracker.trackTime": "تتبع الوقت",
    "taskTracker.exceedsPlannedTime": "الوقت يتجاوز ما كان مخططا له",
    
    // Analytics
    "analysis.title": "تحليل المهام",
    "analysis.week": "هذا الأسبوع",
    "analysis.month": "هذا الشهر",
    "analysis.pie": "دائري",
    "analysis.bar": "شريطي",
    "analysis.noData": "لا توجد بيانات متاحة بعد. أكمل بعض المهام لرؤية التحليلات.",
    "analysis.totalTime": "إجمالي الوقت المستغرق",
    "analysis.of": "من",
    "analysis.planned": "مخطط",
    "analysis.actual": "فعلي",
    "analysis.efficiency": "الكفاءة",
    "analysis.efficient": "كفاءة",
    "analysis.taskDetails": "تفاصيل المهام",
    "analysis.mostEfficient": "المهمة الأكثر كفاءة",
    "analysis.leastEfficient": "المهمة الأقل كفاءة",
    "analysis.occurrences": "مرات",
    
    // Reset dialog
    "reset.title": "إعادة تعيين البيانات",
    "reset.description": "سيؤدي هذا إلى مسح جميع مهامك وسجلك. لا يمكن التراجع عن هذا الإجراء.",
    "reset.cancel": "إلغاء",
    "reset.confirm": "نعم، إعادة التعيين",
    
    // Toasts
    "toast.taskAdded": "تمت إضافة المهمة بنجاح!",
    "toast.taskRemoved": "تمت إزالة المهمة بنجاح!",
    "toast.timeUpdated": "تم تحديث الوقت بنجاح!",
    "toast.dataCleared": "تم مسح جميع البيانات بنجاح!",
    "toast.error.emptyName": "لا يمكن أن يكون اسم المهمة فارغًا",
    "toast.error.zeroDuration": "يجب أن تكون مدة المهمة أكبر من 0",
    "toast.error.exceed24": "لا يمكن أن يتجاوز الوقت الإجمالي 24 ساعة",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
    // Set direction for the entire app
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return resources[language][key as keyof typeof resources[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
