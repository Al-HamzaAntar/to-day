
import React, { useState } from "react";
import { Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimePicker from "@/components/ui/TimePicker";
import { calculateRemainingTime, formatTime, timeInMinutes } from "@/lib/timeUtils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";
import { toast } from "sonner";
import { toLocaleDigits, formatTimeString } from "@/lib/formatUtils";

interface TaskTrackerProps {
  tasks: Task[];
  onUpdateActualTime: (taskId: string, hours: number, minutes: number) => void;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ tasks, onUpdateActualTime }) => {
  const { t, language } = useLanguage();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [newHours, setNewHours] = useState<number>(0);
  const [newMinutes, setNewMinutes] = useState<number>(0);

  const handleEdit = (task: Task) => {
    setActiveTaskId(task.id);
    // Reset values to 0 when starting to edit
    setNewHours(0);
    setNewMinutes(0);
  };

  const handleSave = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // Get current actual time (or 0 if not tracked yet)
      const currentHours = task.actualHours || 0;
      const currentMinutes = task.actualMinutes || 0;
      
      // Add the new time to the current time
      let totalMinutes = currentMinutes + newMinutes;
      let totalHours = currentHours + newHours;
      
      // Convert excess minutes to hours
      if (totalMinutes >= 60) {
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes %= 60;
      }
      
      // Convert both times to minutes for easy comparison
      const plannedTimeInMinutes = timeInMinutes(task.plannedHours, task.plannedMinutes);
      const newTimeInMinutes = timeInMinutes(totalHours, totalMinutes);
      
      // Check if new time exceeds planned time
      if (newTimeInMinutes > plannedTimeInMinutes) {
        toast.error(t("taskTracker.exceedsPlannedTime"));
        return;
      }
      
      // Update with accumulated time
      onUpdateActualTime(taskId, totalHours, totalMinutes);
    }
    setActiveTaskId(null);
  };

  const isArabic = language === "ar";

  // Format time with appropriate locale digits and units
  const formatTimeWithLocale = (hours: number, minutes: number): string => {
    const formattedHours = hours.toString();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    
    if (isArabic) {
      return `${toLocaleDigits(formattedHours, true)}س ${toLocaleDigits(formattedMinutes, true)}د`;
    }
    
    return `${formattedHours}h ${formattedMinutes}m`;
  };

  const isRtl = language === "ar";

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className={`text-xl font-semibold ${isRtl ? 'text-right' : ''}`}>{t("taskTracker.title")}</h2>
      
      {tasks.length === 0 ? (
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="text-muted-foreground">{t("taskTracker.noTasks")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const isActive = activeTaskId === task.id;
            const remainingTime = calculateRemainingTime(task);
            const completed = task.actualHours !== null;
            const progress = completed
              ? Math.min(
                  100,
                  ((task.actualHours! * 60 + task.actualMinutes!) /
                    (task.plannedHours * 60 + task.plannedMinutes)) *
                    100
                )
              : 0;

            return (
              <Card
                key={task.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div
                  className="h-1"
                  style={{ backgroundColor: task.color }}
                />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span className={`truncate ${isRtl ? "order-last" : "order-first"}`}>{task.name}</span>
                    <span className={`text-xs font-normal bg-secondary px-2 py-1 rounded-full ${isRtl ? "order-first" : "order-last"}`}>
                      {t("taskTracker.plan")} {formatTimeWithLocale(task.plannedHours, task.plannedMinutes)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isActive ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 items-end">
                        <div>
                          <label className={`text-xs font-medium mb-1 block ${isRtl ? 'text-right' : ''}`}>
                            {t("taskTracker.hours")}
                          </label>
                          <TimePicker
                            value={newHours}
                            onChange={setNewHours}
                            unit="hours"
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-medium mb-1 block ${isRtl ? 'text-right' : ''}`}>
                            {t("taskTracker.minutes")}
                          </label>
                          <TimePicker
                            value={newMinutes}
                            onChange={setNewMinutes}
                            unit="minutes"
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleSave(task.id)}
                      >
                        {t("taskTracker.saveTime")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className={`flex justify-between text-sm ${isRtl ? "flex-row-reverse" : ""}`}>
                        <span className="text-muted-foreground">{t("taskTracker.actual")}</span>
                        <span>
                          {completed
                            ? formatTimeWithLocale(task.actualHours!, task.actualMinutes!)
                            : t("taskTracker.notTracked")}
                        </span>
                      </div>
                      
                      {completed && (
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full time-progress ${isRtl ? 'float-right' : 'float-left'}`}
                            style={{
                              width: `${progress}%`,
                              backgroundColor: task.color,
                            }}
                          />
                        </div>
                      )}
                      
                      <div className={`flex justify-between text-sm ${isRtl ? "flex-row-reverse" : ""}`}>
                        <span className="text-muted-foreground">{t("taskTracker.remaining")}</span>
                        <span>
                          {completed
                            ? formatTimeWithLocale(remainingTime.hours, remainingTime.minutes)
                            : "-"}
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleEdit(task)}
                      >
                        {completed ? t("taskTracker.updateTime") : t("taskTracker.trackTime")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
