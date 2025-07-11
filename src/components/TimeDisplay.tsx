
import React from "react";
import { Task } from "@/types";
import { calculateTotalTime, calculateActualTotalTime, formatTime } from "@/lib/timeUtils";
import { useLanguage } from "./LanguageProvider";
import { toLocaleDigits, formatTimeString } from "@/lib/formatUtils";

interface TimeDisplayProps {
  tasks: Task[];
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ tasks }) => {
  const { t, language } = useLanguage();
  const totalTime = calculateTotalTime(tasks);
  const totalHours = totalTime.hours;
  const totalMinutes = totalTime.minutes;
  
  const totalActualTime = calculateActualTotalTime(tasks);
  const totalActualHours = totalActualTime.hours;
  const totalActualMinutes = totalActualTime.minutes;
  
  const remainingHours = 24 - totalHours;
  const remainingMinutes = totalMinutes > 0 ? 60 - totalMinutes : 0;
  
  // Adjust remaining hours if we borrowed minutes
  const adjustedRemainingHours = totalMinutes > 0 ? remainingHours - 1 : remainingHours;
  
  // Calculate completion percentage based on actual time vs planned time
  const totalPlannedMinutes = totalHours * 60 + totalMinutes;
  const actualMinutesTotal = totalActualHours * 60 + totalActualMinutes;
  const completionPercentage = totalPlannedMinutes > 0 
    ? Math.min(100, (actualMinutesTotal / totalPlannedMinutes) * 100) 
    : 0;

  const isArabic = language === "ar";

  // Format time with appropriate locale digits and units
  const formatTimeWithLocale = (hours: number, minutes: number): string => {
    const formattedHours = hours.toString();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    
    if (isArabic) {
      return `${toLocaleDigits(hours, true)}س ${toLocaleDigits(minutes < 10 ? `0${minutes}` : minutes, true)}د`;
    }
    
    return `${formattedHours}h ${formattedMinutes}m`;
  };

  const isRtl = language === "ar";

  return (
    <div className="mb-8 w-full animate-fade-in">
      <h2 className={`text-xl font-semibold mb-2 ${isRtl ? 'text-right' : ''}`}>{t("time.allocation")}</h2>
      <div className="w-full h-6 bg-secondary rounded-full overflow-hidden">
        {tasks.map((task, index) => {
          const widthPercent = ((task.plannedHours * 60 + task.plannedMinutes) / (24 * 60)) * 100;
          return (
            <div
              key={task.id}
              className={`h-full ${isRtl ? 'float-right' : 'float-left'} transition-all duration-300 ease-in-out`}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: task.color,
              }}
              title={`${task.name}: ${formatTimeWithLocale(task.plannedHours, task.plannedMinutes)}`}
            />
          );
        })}
      </div>
      
      <div className={`flex items-center justify-between mt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
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
          <span>{formatTimeWithLocale(24, 0)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
          <h3 className="font-medium text-sm">{t("time.completion")}</h3>
          <span className="text-sm font-medium">
            {isArabic ? toLocaleDigits(Math.round(completionPercentage), true) : Math.round(completionPercentage)}%
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-in-out ${isRtl ? 'float-right' : 'float-left'}`}
            style={{
              width: `${completionPercentage}%`,
              backgroundColor: "hsl(var(--primary))",
            }}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className={`font-medium text-sm mb-2 ${isRtl ? 'text-right' : ''}`}>{t("time.breakdown")}</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tasks.map((task) => (
            <div key={task.id} className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
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
