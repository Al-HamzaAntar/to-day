
import React, { useState } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TimePicker from "@/components/ui/TimePicker";
import { X } from "lucide-react";
import { calculateTotalTime, getRandomColor, validateTotalTime } from "@/lib/timeUtils";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";

interface TaskAllocationProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
}

const TaskAllocation: React.FC<TaskAllocationProps> = ({
  tasks,
  onAddTask,
  onRemoveTask,
}) => {
  const { t, language } = useLanguage();
  const [taskName, setTaskName] = useState("");
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const handleAddTask = () => {
    if (!taskName.trim()) {
      toast.error(t("toast.error.emptyName"));
      return;
    }

    if (hours === 0 && minutes === 0) {
      toast.error(t("toast.error.zeroDuration"));
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      plannedHours: hours,
      plannedMinutes: minutes,
      actualHours: null,
      actualMinutes: null,
      color: getRandomColor(),
    };

    const tasksWithNewTask = [...tasks, newTask];
    
    if (!validateTotalTime(tasksWithNewTask)) {
      toast.error(t("toast.error.exceed24"));
      return;
    }

    onAddTask(newTask);
    setTaskName("");
    setHours(1);
    setMinutes(0);
  };

  // Convert western digits to Arabic digits
  const toArabicDigits = (num: number): string => {
    if (language !== "ar") return num.toString();
    return num.toString().replace(/\d/g, d => 
      String.fromCharCode(1632 + parseInt(d, 10))
    );
  };

  const totalTime = calculateTotalTime(tasks);
  const totalHours = totalTime.hours;
  const totalMinutes = totalTime.minutes;
  const timeLeft = {
    hours: 24 - totalHours - (totalMinutes > 0 ? 1 : 0),
    minutes: totalMinutes > 0 ? 60 - totalMinutes : 0,
  };

  const getPlaceholder = () => {
    if (language === "ar") {
      return "مثال: النوم، العمل، الرياضة...";
    }
    return "e.g., Sleep, Work, Exercise...";
  };

  const formatTimeDisplay = (hours: number, minutes: number) => {
    if (language === "ar") {
      return `${toArabicDigits(hours)}س ${toArabicDigits(minutes)}د`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold">{t("taskAllocation.title")}</h2>
      
      <div className="p-5 rounded-lg glass">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="md:col-span-2">
              <label htmlFor="task-name" className="text-sm font-medium mb-1.5 block">
                {t("taskAllocation.taskName")}
              </label>
              <Input
                id="task-name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full"
              />
            </div>
            
            <div className="flex space-x-2 items-end">
              <div>
                <label htmlFor="hours" className="text-sm font-medium mb-1.5 block">
                  {t("taskAllocation.hours")}
                </label>
                <TimePicker
                  value={hours}
                  onChange={setHours}
                  unit="hours"
                />
              </div>
              
              <div>
                <label htmlFor="minutes" className="text-sm font-medium mb-1.5 block">
                  {t("taskAllocation.minutes")}
                </label>
                <TimePicker
                  value={minutes}
                  onChange={setMinutes}
                  unit="minutes"
                />
              </div>
            </div>
            
            <div>
              <Button 
                onClick={handleAddTask} 
                className="w-full"
              >
                {t("taskAllocation.addTask")}
              </Button>
            </div>
          </div>
          
          <div className="text-sm mt-2">
            <span className="font-medium">{t("taskAllocation.timeLeft")} </span>
            <span className={timeLeft.hours < 0 ? "text-destructive" : ""}>
              {timeLeft.hours < 0 ? t("taskAllocation.exceededBy") + " " : ""}
              {formatTimeDisplay(Math.abs(timeLeft.hours), timeLeft.minutes)}
            </span>
          </div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t("taskAllocation.yourTasks")}</h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center p-3 rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors"
              >
                <div className={`flex items-center ${language === "ar" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-3 h-3 rounded-full ${language === "ar" ? "ml-3" : "mr-3"}`}
                    style={{ backgroundColor: task.color }}
                  />
                  <span className="font-medium">{task.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    {formatTimeDisplay(task.plannedHours, task.plannedMinutes)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => onRemoveTask(task.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAllocation;
