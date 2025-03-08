import React from "react";
import { Task } from "@/types";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";
import { calculateTotalTime, calculateActualTotalTime } from "@/lib/timeUtils";
import { useLanguage } from "./LanguageProvider";

interface TimeDisplayProps {
  tasks: Task[];
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ tasks }) => {
  const { t } = useLanguage();
  const totalPlannedTime = calculateTotalTime(tasks);
  const totalActualTime = calculateActualTotalTime(tasks);

  const plannedHours = totalPlannedTime.hours;
  const plannedMinutes = totalPlannedTime.minutes;
  const actualHours = totalActualTime.hours;
  const actualMinutes = totalActualTime.minutes;

  const totalHours = 24;
  const usedHours = plannedHours;
  const usedMinutes = plannedMinutes;
  const remainingHours = totalHours - usedHours - (usedMinutes > 0 ? 1 : 0);
  const remainingMinutes = usedMinutes > 0 ? 60 - usedMinutes : 0;

  const COLORS = tasks.map((task) => task.color);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${tasks[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      <div className="p-6 rounded-xl glass dark:glass-dark">
        <h2 className="text-xl font-semibold mb-4">{t("time.allocation")}</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>{t("time.used")}</span>
            <span>{plannedHours}h {plannedMinutes}m</span>
          </div>
          <div className="flex justify-between">
            <span>{t("time.remaining")}</span>
            <span>{remainingHours}h {remainingMinutes}m</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>{t("time.total")}</span>
            <span>{totalHours}h 0m</span>
          </div>
          <Progress value={(usedHours / totalHours) * 100} className="h-4" />
        </div>
      </div>

      <div className="p-6 rounded-xl glass dark:glass-dark">
        <h2 className="text-xl font-semibold mb-4">{t("time.breakdown")}</h2>
        {tasks.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tasks}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="plannedHours"
              >
                {tasks.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground">No tasks added yet.</p>
        )}
      </div>
    </div>
  );
};

export default TimeDisplay;
