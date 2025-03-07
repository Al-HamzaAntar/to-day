
import React, { useState } from "react";
import { Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimePicker from "@/components/ui/TimePicker";
import { calculateRemainingTime, formatTime } from "@/lib/timeUtils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";

interface TaskTrackerProps {
  tasks: Task[];
  onUpdateActualTime: (taskId: string, hours: number, minutes: number) => void;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ tasks, onUpdateActualTime }) => {
  const { t, language } = useLanguage();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [additionalHours, setAdditionalHours] = useState<number>(0);
  const [additionalMinutes, setAdditionalMinutes] = useState<number>(0);

  const handleEdit = (task: Task) => {
    setActiveTaskId(task.id);
    // Reset to 0 when editing to indicate we're adding time
    setAdditionalHours(0);
    setAdditionalMinutes(0);
  };

  const handleSave = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // Calculate new total time by adding the additional time to existing time
      const existingHours = task.actualHours || 0;
      const existingMinutes = task.actualMinutes || 0;
      
      // Calculate total minutes
      let totalMinutes = existingMinutes + additionalMinutes;
      // Calculate hour overflow
      const extraHours = Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
      
      // Calculate total hours
      const totalHours = existingHours + additionalHours + extraHours;
      
      onUpdateActualTime(taskId, totalHours, totalMinutes);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold">{t("taskTracker.title")}</h2>
      
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
                    <span className={`truncate ${language === "ar" ? "order-last" : "order-first"}`}>{task.name}</span>
                    <span className={`text-xs font-normal bg-secondary px-2 py-1 rounded-full ${language === "ar" ? "order-first" : "order-last"}`}>
                      {t("taskTracker.plan")} {formatTimeWithLocale(task.plannedHours, task.plannedMinutes)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isActive ? (
                    <div className="space-y-4">
                      {completed && (
                        <div className={`flex justify-between text-sm ${language === "ar" ? "flex-row-reverse" : ""}`}>
                          <span className="text-muted-foreground">{t("taskTracker.currentTotal")}</span>
                          <span>{formatTimeWithLocale(task.actualHours!, task.actualMinutes!)}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 items-end">
                        <div>
                          <label className="text-xs font-medium mb-1 block">
                            {t("taskTracker.additionalHours")}
                          </label>
                          <TimePicker
                            value={additionalHours}
                            onChange={(value: number) => setAdditionalHours(value)}
                            unit="hours"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">
                            {t("taskTracker.additionalMinutes")}
                          </label>
                          <TimePicker
                            value={additionalMinutes}
                            onChange={(value: number) => setAdditionalMinutes(value)}
                            unit="minutes"
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleSave(task.id)}
                      >
                        {t("taskTracker.addTime")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className={`flex justify-between text-sm ${language === "ar" ? "flex-row-reverse" : ""}`}>
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
                            className="h-full time-progress"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: task.color,
                            }}
                          />
                        </div>
                      )}
                      
                      <div className={`flex justify-between text-sm ${language === "ar" ? "flex-row-reverse" : ""}`}>
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
                        {completed ? t("taskTracker.addMoreTime") : t("taskTracker.trackTime")}
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
