
import React, { useState } from "react";
import { Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimePicker from "@/components/ui/TimePicker";
import { calculateRemainingTime, formatTime, timeInMinutes } from "@/lib/timeUtils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";
import { toast } from "sonner";

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
    // If task already has time tracked, set the inputs to current values
    if (task.actualHours !== null && task.actualMinutes !== null) {
      setNewHours(task.actualHours);
      setNewMinutes(task.actualMinutes);
    } else {
      // Reset to 0 when editing a new task
      setNewHours(0);
      setNewMinutes(0);
    }
  };

  const handleSave = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // Convert both times to minutes for easy comparison
      const plannedTimeInMinutes = timeInMinutes(task.plannedHours, task.plannedMinutes);
      const newTimeInMinutes = timeInMinutes(newHours, newMinutes);
      
      // Check if new time exceeds planned time
      if (newTimeInMinutes > plannedTimeInMinutes) {
        toast.error(t("taskTracker.exceedsPlannedTime"));
        return;
      }
      
      // Update the time directly (not adding to previous time)
      onUpdateActualTime(taskId, newHours, newMinutes);
    }
    setActiveTaskId(null);
  };

  const toArabicDigits = (num: number): string => {
    if (language !== "ar") return num.toString();
    return num.toString().replace(/\d/g, d => 
      String.fromCharCode(1632 + parseInt(d, 10))
    );
  };

  const formatTimeWithLocale = (hours: number, minutes: number): string => {
    if (language === "ar") {
      const arabicHours = toArabicDigits(hours);
      const arabicMinutes = toArabicDigits(minutes < 10 ? `0${minutes}` : minutes);
      return `${arabicHours}س ${arabicMinutes}د`;
    }
    return formatTime(hours, minutes);
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
                            onChange={(value) => setNewHours(value)}
                            unit="hours"
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-medium mb-1 block ${isRtl ? 'text-right' : ''}`}>
                            {t("taskTracker.minutes")}
                          </label>
                          <TimePicker
                            value={newMinutes}
                            onChange={(value) => setNewMinutes(value)}
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
