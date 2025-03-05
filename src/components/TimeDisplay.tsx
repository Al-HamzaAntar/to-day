
import React from "react";
import { Task } from "@/types";
import { calculateTotalTime, formatTime } from "@/lib/timeUtils";

interface TimeDisplayProps {
  tasks: Task[];
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ tasks }) => {
  const totalTime = calculateTotalTime(tasks);
  const totalHours = totalTime.hours;
  const totalMinutes = totalTime.minutes;
  
  const remainingHours = 24 - totalHours;
  const remainingMinutes = totalMinutes > 0 ? 60 - totalMinutes : 0;
  
  // Adjust remaining hours if we borrowed minutes
  const adjustedRemainingHours = totalMinutes > 0 ? remainingHours - 1 : remainingHours;
  
  const timeUsedPercentage = ((totalHours * 60 + totalMinutes) / (24 * 60)) * 100;

  return (
    <div className="mb-8 w-full animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">Time Allocation</h2>
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
              title={`${task.name}: ${task.plannedHours}h ${task.plannedMinutes}m`}
            />
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">
          <span className="font-medium">Used: </span>
          <span>{formatTime(totalHours, totalMinutes)}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Remaining: </span>
          <span>
            {formatTime(
              adjustedRemainingHours < 0 ? 0 : adjustedRemainingHours,
              remainingMinutes
            )}
          </span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Total: </span>
          <span>24h 00m</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-sm mb-2">Task Breakdown</h3>
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
