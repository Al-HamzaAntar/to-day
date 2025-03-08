import React, { useState } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import TimePicker from "@/components/ui/TimePicker";
import {
  calculateActualTotalTime,
  formatTime,
  validateActualTotalTime,
} from "@/lib/timeUtils";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";

interface TaskTrackerProps {
  tasks: Task[];
  onUpdateActualTime: (taskId: string, hours: number, minutes: number) => void;
}

interface TaskTime {
  hours: number | null;
  minutes: number | null;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ tasks, onUpdateActualTime }) => {
  const { t, language } = useLanguage();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [actualHours, setActualHours] = useState<number | null>(null);
  const [actualMinutes, setActualMinutes] = useState<number | null>(null);

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(taskId);
    setActualHours(task?.actualHours || 0);
    setActualMinutes(task?.actualMinutes || 0);
  };

  const handleSaveTime = () => {
    if (!selectedTask || actualHours === null || actualMinutes === null) return;

    const task = tasks.find((task) => task.id === selectedTask);
    if (!task) return;

    if (actualHours === task.plannedHours && actualMinutes > task.plannedMinutes) {
      toast.error(t("taskTracker.exceedsPlannedTime"));
      return;
    }

    if (actualHours > task.plannedHours) {
      toast.error(t("taskTracker.exceedsPlannedTime"));
      return;
    }

    onUpdateActualTime(selectedTask, actualHours, actualMinutes);
    setSelectedTask(null);
  };

  const getTaskTime = (taskId: string): TaskTime => {
    const task = tasks.find((task) => task.id === taskId);
    return {
      hours: task?.actualHours || null,
      minutes: task?.actualMinutes || null,
    };
  };

  const calculateRemainingTime = (task: Task) => {
    const actualHoursValue = task.actualHours !== null ? task.actualHours : 0;
    const actualMinutesValue = task.actualMinutes !== null ? task.actualMinutes : 0;

    let remainingHours = task.plannedHours - actualHoursValue;
    let remainingMinutes = task.plannedMinutes - actualMinutesValue;

    if (remainingMinutes < 0) {
      remainingHours--;
      remainingMinutes += 60;
    }

    if (remainingHours < 0) {
      remainingHours = 0;
      remainingMinutes = 0;
    }

    return { hours: remainingHours, minutes: remainingMinutes };
  };

  const currentTotalTime = calculateActualTotalTime(tasks);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold">{t("taskTracker.title")}</h2>

      {tasks.length === 0 ? (
        <div className="p-5 rounded-lg glass">
          <p className="text-center text-muted-foreground">{t("taskTracker.noTasks")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isSelected = selectedTask === task.id;
            const taskTime = getTaskTime(task.id);
            const remainingTime = calculateRemainingTime(task);

            return (
              <div
                key={task.id}
                className="p-5 rounded-lg glass"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: task.color }}
                    />
                    <h3 className="text-lg font-medium">{task.name}</h3>
                  </div>
                  
                  <div>
                    {isSelected ? (
                      <Button variant="secondary" size="sm" onClick={handleSaveTime}>
                        {t("taskTracker.saveTime")}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleTaskSelect(task.id)}>
                        {taskTime.hours !== null && taskTime.minutes !== null
                          ? t("taskTracker.updateTime")
                          : t("taskTracker.trackTime")}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("taskTracker.plan")}</p>
                    <p className="font-medium">
                      {formatTime(task.plannedHours, task.plannedMinutes)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("taskTracker.actual")}</p>
                    {isSelected ? (
                      <div className="flex items-center space-x-2">
                        <TimePicker
                          value={actualHours !== null ? actualHours : 0}
                          onChange={(value: number) => setActualHours(value)}
                          unit="hours"
                          max={task.plannedHours}
                        />
                        <TimePicker
                          value={actualMinutes !== null ? actualMinutes : 0}
                          onChange={(value: number) => setActualMinutes(value)}
                          unit="minutes"
                          max={59}
                        />
                      </div>
                    ) : taskTime.hours !== null && taskTime.minutes !== null ? (
                      <p className="font-medium">
                        {formatTime(taskTime.hours, taskTime.minutes)}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">{t("taskTracker.notTracked")}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("taskTracker.remaining")}</p>
                    <p className="font-medium">
                      {formatTime(remainingTime.hours, remainingTime.minutes)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-6">
            <h3 className="text-lg font-medium">{t("taskTracker.currentTotal")}:</h3>
            <p className="text-muted-foreground">
              {formatTime(currentTotalTime.hours, currentTotalTime.minutes)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
