
import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import TaskAllocation from "@/components/TaskAllocation";
import TaskTracker from "@/components/TaskTracker";
import TaskAnalysis from "@/components/TaskAnalysis";
import TimeDisplay from "@/components/TimeDisplay";
import DailyReminder from "@/components/DailyReminder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateActualTotalTime, calculateTotalTime, saveTasksHistory } from "@/lib/timeUtils";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import { BarChart4, RefreshCw } from "lucide-react";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ExportButton from "@/components/ExportButton";
import { toLocaleDigits, formatTimeString } from "@/lib/formatUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("today-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [activeTab, setActiveTab] = useState("allocate");
  const isArabic = language === "ar";

  useEffect(() => {
    localStorage.setItem("today-tasks", JSON.stringify(tasks));
    
    // Save tasks history if any task has actual time tracked
    if (tasks.some(task => task.actualHours !== null)) {
      saveTasksHistory(tasks);
    }
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    toast.success(t("toast.taskAdded"));
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success(t("toast.taskRemoved"));
  };

  const handleUpdateActualTime = (taskId: string, hours: number, minutes: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, actualHours: hours, actualMinutes: minutes }
          : task
      )
    );
    toast.success(t("toast.timeUpdated"));
  };

  const resetAllData = () => {
    setTasks([]);
    localStorage.removeItem("today-tasks");
    toast.success(t("toast.dataCleared"));
  };

  const handlePlanNow = () => {
    setActiveTab("allocate");
    if (tasks.length === 0) {
      toast.info(t("dailyReminder.startPlanning"));
    }
  };

  const totalPlannedTime = calculateTotalTime(tasks);
  const totalActualTime = calculateActualTotalTime(tasks);
  
  // Format time with appropriate locale digits and units
  const formatTimeWithLocale = (hours: number, minutes: number): string => {
    const formattedHours = hours.toString();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    
    if (isArabic) {
      return `${toLocaleDigits(formattedHours, true)}س ${toLocaleDigits(formattedMinutes, true)}د`;
    }
    
    return `${formattedHours}h ${formattedMinutes}m`;
  };
  
  const trackedCount = tasks.filter(
    (task) => task.actualHours !== null && task.actualMinutes !== null
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <DailyReminder onPlanNow={handlePlanNow} />
      
      <div className={`container mx-auto py-8 px-4 max-w-5xl ${language === 'ar' ? 'font-arabic' : ''}`}>
        <div className="flex justify-between mb-4 gap-2">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("reset.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("reset.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("reset.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAllData}>{t("reset.confirm")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <ExportButton tasks={tasks} />
          </div>
          
          <div className="flex gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        
        <div className="text-center mb-10 animate-slide-down">
          <h1 className="text-4xl font-bold tracking-tight">{t("app.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("app.description")}
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="mb-8 p-6 rounded-xl glass dark:glass-dark animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-medium">{t("dashboard.tasksPlanned")}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-medium">{isArabic ? toLocaleDigits(tasks.length, true) : tasks.length}</span>
                  <span className="text-muted-foreground text-sm">
                    {formatTimeWithLocale(totalPlannedTime.hours, totalPlannedTime.minutes)} {t("dashboard.planned")}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-medium">{t("dashboard.tasksTracked")}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-medium">{isArabic ? toLocaleDigits(trackedCount, true) : trackedCount}</span>
                  <span className="text-muted-foreground text-sm">
                    {formatTimeWithLocale(totalActualTime.hours, totalActualTime.minutes)} {t("dashboard.tracked")}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-medium">{t("dashboard.completion")}</h3>
                <div className="flex items-center gap-3">
                  <Progress value={trackedCount / Math.max(1, tasks.length) * 100} className="h-2" />
                  <span className="text-sm font-medium">
                    {isArabic 
                      ? toLocaleDigits(Math.round(trackedCount / Math.max(1, tasks.length) * 100), true) 
                      : Math.round(trackedCount / Math.max(1, tasks.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tasks.length > 0 && <TimeDisplay tasks={tasks} />}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="allocate" className="flex-1">{t("tabs.plan")}</TabsTrigger>
            <TabsTrigger value="track" className="flex-1">{t("tabs.track")}</TabsTrigger>
            <TabsTrigger value="analyze" className="flex-1 flex items-center justify-center gap-1">
              <BarChart4 className="h-4 w-4" />
              <span>{t("tabs.analyze")}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocate" className="pt-2">
            <TaskAllocation
              tasks={tasks}
              onAddTask={handleAddTask}
              onRemoveTask={handleRemoveTask}
            />
          </TabsContent>
          
          <TabsContent value="track" className="pt-2">
            <TaskTracker
              tasks={tasks}
              onUpdateActualTime={handleUpdateActualTime}
            />
          </TabsContent>
          
          <TabsContent value="analyze" className="pt-2">
            <TaskAnalysis />
          </TabsContent>
        </Tabs>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
