
import React from "react";
import { Task } from "@/types";
import { calculateTotalTime, formatTime } from "@/lib/timeUtils";
import { useLanguage } from "./LanguageProvider";

interface TimeDisplayProps {
  tasks: Task[];
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ tasks }) => {
  const { t, language } = useLanguage();
  const totalTime = calculateTotalTime(tasks);
  const totalHours = totalTime.hours;
  const totalMinutes = totalTime.minutes;
  
  const remainingHours = 24 - totalHours;
  const remainingMinutes = totalMinutes > 0 ? 60 - totalMinutes : 0;
  
  // Adjust remaining hours if we borrowed minutes
  const adjustedRemainingHours = totalMinutes > 0 ? remainingHours - 1 : remainingHours;
  
  const timeUsedPercentage = ((totalHours * 60 + totalMinutes) / (24 * 60)) * 100;

  // Convert western digits to Arabic digits
  const toArabicDigits = (num: number): string => {
    if (language !== "ar") return num.toString();
    return num.toString().replace(/\d/g, d => 
      String.fromCharCode(1632 + parseInt(d, 10))
    );
  };

  // Format time with Arabic numerals if needed
  const formatTimeWithLocale = (hours: number, minutes: number): string => {
    if (language === "ar") {
      return `${toArabicDigits(hours)}h ${toArabicDigits(minutes)}m`;
    }
    return formatTime(hours, minutes);
  };

  return (
    <div className="mb-8 w-full animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">{t("time.allocation")}</h2>
      <div className="w-full h-6 bg-secondary rounded-full overflow-hidden">
        {tasks.map((task, index) => {
          const widthPercent = ((task.plannedHours * 60 + task.plannedMinutes) / (24 * 60)) * 100;
          return (
            <div
              key={task.id}
              className="h-full float-left transition-all duration-300 ease-in-out"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: task.color,
              }}
              title={`${task.name}: ${formatTimeWithLocale(task.plannedHours, task.plannedMinutes)}`}
            />
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">
          <span className="font-medium">{t("time.used")} </span>
          <span>{formatTimeWithLocale(totalHours, totalMinutes)}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">{t("time.remaining")} </span>
          <span>
            {formatTimeWithLocale(
              adjustedRemainingHours < 0 ? 0 : adjustedRemainingHours,
              remainingMinutes
            )}
          </span>
        </div>
        <div className="text-sm">
          <span className="font-medium">{t("time.total")} </span>
          <span>{language === "ar" ? `${toArabicDigits(24)}h ${toArabicDigits(0)}m` : "24h 00m"}</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-sm mb-2">{t("time.breakdown")}</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: task.color }}
              />
              <span className="text-sm truncate" title={task.name}>
                {task.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
