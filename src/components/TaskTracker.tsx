
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
  const { t } = useLanguage();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [actualHours, setActualHours] = useState<number>(0);
  const [actualMinutes, setActualMinutes] = useState<number>(0);

  const handleEdit = (task: Task) => {
    setActiveTaskId(task.id);
    setActualHours(task.actualHours !== null ? task.actualHours : 0);
    setActualMinutes(task.actualMinutes !== null ? task.actualMinutes : 0);
  };

  const handleSave = (taskId: string) => {
    onUpdateActualTime(taskId, actualHours, actualMinutes);
    setActiveTaskId(null);
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
                    <span className="truncate">{task.name}</span>
                    <span className="text-xs font-normal bg-secondary px-2 py-1 rounded-full">
                      {t("taskTracker.plan")} {task.plannedHours}h {task.plannedMinutes}m
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isActive ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 items-end">
                        <div>
                          <label className="text-xs font-medium mb-1 block">
                            {t("taskTracker.actualHours")}
                          </label>
                          <TimePicker
                            value={actualHours}
                            onChange={setActualHours}
                            unit="hours"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">
                            {t("taskTracker.actualMinutes")}
                          </label>
                          <TimePicker
                            value={actualMinutes}
                            onChange={setActualMinutes}
                            unit="minutes"
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleSave(task.id)}
                      >
                        {t("taskTracker.save")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("taskTracker.actual")}</span>
                        <span>
                          {completed
                            ? `${task.actualHours}h ${task.actualMinutes}m`
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
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("taskTracker.remaining")}</span>
                        <span>
                          {completed
                            ? formatTime(remainingTime.hours, remainingTime.minutes)
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
