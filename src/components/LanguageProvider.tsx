import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    
    "hourlyReminder.title": "Task Reminder",
    "hourlyReminder.description": "Don't forget to track your tasks for this hour!",
    
    "export.button": "Export",
    "export.excel": "Excel (.xlsx)",
    "export.csv": "CSV (.csv)",
    "export.title": "Export Data",
    "export.copy": "Copy to Clipboard",
    "export.download": "Download as JSON",
    "export.success": "Copied to clipboard!",
    
    "dailyReminder.title": "Plan Your Day",
    "dailyReminder.description": "It's a new day! Time to plan your activities.",
    "dailyReminder.prompt": "Would you like to allocate your tasks for today?",
    "dailyReminder.later": "Remind Me Later",
    "dailyReminder.planNow": "Plan Now",
    "dailyReminder.startPlanning": "Start by adding tasks to your day",
    
    "help.title": "How to Use Daily Time Tracker",
    "help.general": "General",
    "help.planning": "Planning",
    "help.tracking": "Tracking",
    "help.analyzing": "Analyzing",
    "help.welcome": "Welcome to Daily Time Tracker!",
    "help.description": "This application helps you plan, track, and analyze how you spend your time each day. Follow the guides below to get the most out of this tool.",
    "help.overview": "How It Works",
    "help.step1": "Plan your day by allocating tasks and time",
    "help.step2": "Track the actual time spent on each task",
    "help.step3": "Analyze your time usage patterns for better productivity",
    "help.featuresTitle": "Key Features",
    "help.feature1": "Allocate 24 hours of your day across different tasks",
    "help.feature2": "Track actual time spent on tasks",
    "help.feature3": "Visual time breakdown with charts and graphs",
    "help.feature4": "Daily reminders to plan your day",
    "help.feature5": "Export your data for further analysis",
    
    "help.planTitle": "Planning Your Day",
    "help.planDescription": "Start your day by planning tasks and allocating time to each activity you want to accomplish.",
    "help.howToPlan": "How to Plan Your Day",
    "help.planStep1": "Go to the 'Plan' tab",
    "help.planStep2": "Enter a task name in the input field",
    "help.planStep3": "Set hours and minutes for the task",
    "help.planStep4": "Click 'Add Task' to add it to your daily plan",
    "help.planTips": "Planning Tips",
    "help.planTip1": "Be realistic about how long tasks will take",
    "help.planTip2": "Remember to plan breaks and meals",
    "help.planTip3": "The time bar will show how much of your 24 hours are allocated",
    
    "help.trackTitle": "Tracking Your Time",
    "help.trackDescription": "As you complete tasks throughout your day, track the actual time spent on each activity.",
    "help.howToTrack": "How to Track Your Time",
    "help.trackStep1": "Go to the 'Track' tab",
    "help.trackStep2": "Find the task you've completed",
    "help.trackStep3": "Enter the actual time spent and click 'Save Time'",
    "help.trackTips": "Tracking Tips",
    "help.trackTip1": "Track time immediately after completing a task for accuracy",
    "help.trackTip2": "The progress bar shows how your actual time compares to planned time",
    "help.trackTip3": "You can update time entries if you need to make corrections",
    
    "help.analyzeTitle": "Analyzing Your Time",
    "help.analyzeDescription": "Review how you've spent your time to identify patterns and areas for improvement.",
    "help.howToAnalyze": "How to Analyze Your Data",
    "help.analyzeStep1": "Go to the 'Analyze' tab",
    "help.analyzeStep2": "Choose between daily, weekly, or monthly views",
    "help.analyzeStep3": "Toggle between pie chart and bar chart visualizations",
    "help.analyzeTips": "Analysis Tips",
    "help.analyzeTip1": "Look for tasks that consistently take longer than planned",
    "help.analyzeTip2": "Identify your most and least efficient tasks",
    "help.analyzeTip3": "Use this data to improve your future time allocation",
    
    "help.helpButton": "Help",
    "gettingStarted.title": "Getting Started",
    "gettingStarted.welcome": "Welcome to Daily Time Tracker!",
    "gettingStarted.intro": "This app helps you plan, track, and analyze how you spend your time each day.",
    "gettingStarted.planTab": "Plan",
    "gettingStarted.trackTab": "Track",
    "gettingStarted.analyzeTab": "Analyze",
    "gettingStarted.planHeading": "Plan Your Day",
    "gettingStarted.planDesc": "Start by allocating time to the tasks you want to accomplish today.",
    "gettingStarted.planStepsHeading": "How to Plan:",
    "gettingStarted.planStep1": "Enter task name and allocate time (hours and minutes)",
    "gettingStarted.planStep2": "Add as many tasks as you need",
    "gettingStarted.planStep3": "Review your time allocation to ensure a balanced day",
    "gettingStarted.trackHeading": "Track Your Time",
    "gettingStarted.trackDesc": "Throughout your day, record the actual time spent on each task.",
    "gettingStarted.trackStepsHeading": "How to Track:",
    "gettingStarted.trackStep1": "Select a task from your planned list",
    "gettingStarted.trackStep2": "Enter the actual time spent and save",
    "gettingStarted.analyzeHeading": "Analyze Your Time",
    "gettingStarted.analyzeDesc": "Gain insights into how you spend your time and improve your planning.",
    "gettingStarted.analyzeStepsHeading": "How to Analyze:",
    "gettingStarted.analyzeStep1": "View your time usage in charts and statistics",
    "gettingStarted.analyzeStep2": "Compare planned vs. actual time to improve future planning",
    "gettingStarted.getStarted": "Got it!",
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
    
    "hourlyReminder.title": "تذكير بالمهام",
    "hourlyReminder.description": "لا تنسى تتبع مهامك لهذه الساعة!",
    
    "export.button": "تصدير",
    "export.excel": "إكسل (.xlsx)",
    "export.csv": "ملف CSV (.csv)",
    "export.title": "تصدير البيانات",
    "export.copy": "نسخ إلى الحافظة",
    "export.download": "تنزيل كـ JSON",
    "export.success": "تم النسخ إلى الحافظة!",
    
    "dailyReminder.title": "خطط ليومك",
    "dailyReminder.description": "إنه يوم جديد! حان الوقت لتخطيط أنشطتك.",
    "dailyReminder.prompt": "هل ترغب في توزيع مهامك لهذا اليوم؟",
    "dailyReminder.later": "ذكرني لاحقًا",
    "dailyReminder.planNow": "خطط الآن",
    "dailyReminder.startPlanning": "ابدأ بإضافة مهام ليومك",
    
    "help.title": "كيفية استخدام متتبع الوقت اليومي",
    "help.general": "عام",
    "help.planning": "التخطيط",
    "help.tracking": "التتبع",
    "help.analyzing": "التحليل",
    "help.welcome": "مرحبًا بك في متتبع الوقت اليومي!",
    "help.description": "يساعدك هذا التطبيق على تخطيط وتتبع وتحليل كيفية قضاء وقتك كل يوم. اتبع الإرشادات أدناه للحصول على أقصى استفادة من هذه الأداة.",
    "help.overview": "كيف يعمل",
    "help.step1": "خطط ليومك من خلال تخصيص المهام والوقت",
    "help.step2": "تتبع الوقت الفعلي المستغرق في كل مهمة",
    "help.step3": "تحليل أنماط استخدام الوقت لتحسين الإنتاجية",
    "help.featuresTitle": "الميزات الرئيسية",
    "help.feature1": "تخصيص ٢٤ ساعة من يومك عبر مهام مختلفة",
    "help.feature2": "تتبع الوقت الفعلي المستغرق في المهام",
    "help.feature3": "تفصيل مرئي للوقت باستخدام الرسوم البيانية",
    "help.feature4": "تذكيرات يومية لتخطيط يومك",
    "help.feature5": "تصدير بياناتك لمزيد من التحليل",
    
    "help.planTitle": "تخطيط يومك",
    "help.planDescription": "ابدأ يومك بتخطيط المهام وتخصيص الوقت لكل نشاط ترغب في إنجازه.",
    "help.howToPlan": "كيفية تخطيط يومك",
    "help.planStep1": "انتقل إلى علامة التبويب 'خطة'",
    "help.planStep2": "أدخل اسم المهمة في حقل الإدخال",
    "help.planStep3": "حدد الساعات والدقائق للمهمة",
    "help.planStep4": "انقر على 'إضافة مهمة' لإضافتها إلى خطتك اليومية",
    "help.planTips": "نصائح التخطيط",
    "help.planTip1": "كن واقعيًا بشأن المدة التي ستستغرقها المهام",
    "help.planTip2": "تذكر أن تخطط لفترات الراحة والوجبات",
    "help.planTip3": "سيوضح شريط الوقت مقدار ما تم تخصيصه من ٢٤ ساعة",
    
    "help.trackTitle": "تتبع وقتك",
    "help.trackDescription": "أثناء إكمال المهام على مدار يومك، قم بتتبع الوقت الفعلي المستغرق في كل نشاط.",
    "help.howToTrack": "كيفية تتبع وقتك",
    "help.trackStep1": "انتقل إلى علامة التبويب 'تتبع'",
    "help.trackStep2": "ابحث عن المهمة التي أكملتها",
    "help.trackStep3": "أدخل الوقت الفعلي المستغرق وانقر على 'حفظ الوقت'",
    "help.trackTips": "نصائح التتبع",
    "help.trackTip1": "تتبع الوقت مباشرة بعد الانتهاء من المهمة للحصول على دقة",
    "help.trackTip2": "يوضح شريط التقدم كيف يقارن وقتك الفعلي بالوقت المخطط له",
    "help.trackTip3": "يمكنك تحديث إدخالات الوقت إذا كنت بحاجة إلى إجراء تصحيحات",
    
    "help.analyzeTitle": "تحليل وقتك",
    "help.analyzeDescription": "راجع كيف قضيت وقتك لتحديد الأنماط ومجالات التحسين.",
    "help.howToAnalyze": "كيفية تحليل بياناتك",
    "help.analyzeStep1": "انتقل إلى علامة التبويب 'تحليل'",
    "help.analyzeStep2": "اختر بين العرض اليومي أو الأسبوعي أو الشهري",
    "help.analyzeStep3": "تبديل بين تصورات المخطط الدائري والمخطط الشريطي",
    "help.analyzeTips": "نصائح التحليل",
    "help.analyzeTip1": "ابحث عن المهام التي تستغرق باستمرار وقتًا أطول من المخطط له",
    "help.analyzeTip2": "حدد المهام الأكثر والأقل كفاءة لديك",
    "help.analyzeTip3": "استخدم هذه البيانات لتحسين تخصيص وقتك في المستقبل",
    
    "help.helpButton": "مساعدة",
    "gettingStarted.title": "البدء",
    "gettingStarted.welcome": "مرحبًا بك في متتبع الوقت اليومي!",
    "gettingStarted.intro": "يساعدك هذا التطبيق على تخطيط ومتابعة وتحليل كيفية قضاء وقتك كل يوم.",
    "gettingStarted.planTab": "التخطيط",
    "gettingStarted.trackTab": "المتابعة",
    "gettingStarted.analyzeTab": "التحليل",
    "gettingStarted.planHeading": "خطط ليومك",
    "gettingStarted.planDesc": "ابدأ بتخصيص الوقت للمهام التي تريد إنجازها اليوم.",
    "gettingStarted.planStepsHeading": "كيفية التخطيط:",
    "gettingStarted.planStep1": "أدخل اسم المهمة وخصص الوقت (ساعات ودقائق)",
    "gettingStarted.planStep2": "أضف أكبر عدد ممكن من المهام حسب الحاجة",
    "gettingStarted.planStep3": "راجع تخصيص وقتك لضمان يوم متوازن",
    "gettingStarted.trackHeading": "تتبع وقتك",
    "gettingStarted.trackDesc": "طوال يومك، سجل الوقت الفعلي المستغرق في كل مهمة.",
    "gettingStarted.trackStepsHeading": "كيفية المتابعة:",
    "gettingStarted.trackStep1": "اختر مهمة من قائمة المهام المخططة",
    "gettingStarted.trackStep2": "أدخل الوقت الفعلي المستغرق واحفظه",
    "gettingStarted.analyzeHeading": "تحليل وقتك",
    "gettingStarted.analyzeDesc": "احصل على رؤى حول كيفية قضاء وقتك وتحسين تخطيطك.",
    "gettingStarted.analyzeStepsHeading": "كيفية التحليل:",
    "gettingStarted.analyzeStep1": "اعرض استخدام وقتك في الرسوم البيانية والإحصاءات",
    "gettingStarted.analyzeStep2": "قارن الوقت المخطط مقابل الوقت الفعلي لتحسين التخطيط المستقبلي",
    "gettingStarted.getStarted": "فهمت!",
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with the stored language or default to "en"
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('app-language') || "en";
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

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
