
import React, { useState } from "react";
import { 
  getAnalyticsData, 
  formatTime, 
  getStartOfWeek, 
  getStartOfMonth,
  getStartOfDay,
  formatDate 
} from "@/lib/timeUtils";
import { AnalysisPeriod, TaskAnalytics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";
import { ChartPie, BarChart4, Trophy, Clock, Calendar } from "lucide-react";
import { toLocaleDigits } from "@/lib/formatUtils";

const TaskAnalysis: React.FC = () => {
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState<AnalysisPeriod>("day");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  
  const data = getAnalyticsData(period);
  const hasData = data.length > 0;
  const isArabic = language === "ar";
  
  // Time period description
  const getPeriodDescription = () => {
    const now = new Date();
    if (period === "day") {
      return formatDate(now, isArabic);
    } else if (period === "week") {
      const start = getStartOfWeek();
      return `${formatDate(start, isArabic)} - ${formatDate(now, isArabic)}`;
    } else if (period === "month") {
      const start = getStartOfMonth();
      return `${formatDate(start, isArabic)} - ${formatDate(now, isArabic)}`;
    }
    return "";
  };
  
  // Calculate total times
  const totalPlanned = data.reduce((total, item) => total + item.plannedMinutes, 0);
  const totalActual = data.reduce((total, item) => total + item.actualMinutes, 0);
  const overallEfficiency = totalPlanned > 0 ? Math.min(100, (totalActual / totalPlanned) * 100) : 0;
  
  // Format for charts
  const pieData = data.map(item => ({
    name: item.name,
    value: item.actualMinutes,
    color: `hsl(${data.indexOf(item) * 40}, 70%, 50%)`
  }));
  
  // Custom formatter for tooltip and labels that converts to Arabic digits when needed
  const formatTimeWithLocale = (hours: number, minutes: number): string => {
    return formatTime(hours, minutes, isArabic);
  };

  const formatPercentWithLocale = (value: number): string => {
    return isArabic ? toLocaleDigits(Math.round(value).toString(), true) + "%" : Math.round(value) + "%";
  };

  // Custom label formatter for pie chart
  const renderCustomizedLabel = ({ name, percent }: { name: string, percent: number }) => {
    return `${name} ${formatPercentWithLocale(percent * 100)}`;
  };
  
  // Get most efficient and inefficient tasks
  const mostEfficient = [...data].sort((a, b) => b.efficiency - a.efficiency)[0];
  const leastEfficient = [...data].filter(item => item.actualMinutes > 0)
    .sort((a, b) => a.efficiency - b.efficiency)[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">{t("analysis.title")}</h2>
          {hasData && <p className="text-sm text-muted-foreground">{getPeriodDescription()}</p>}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Tabs value={period} onValueChange={(value) => setPeriod(value as AnalysisPeriod)} className="w-auto">
            <TabsList>
              <TabsTrigger value="day" className="flex gap-1 items-center">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t("analysis.day")}</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex gap-1 items-center">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t("analysis.week")}</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex gap-1 items-center">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t("analysis.month")}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-1">
            <Button 
              variant={chartType === "pie" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartType("pie")}
              className="flex gap-1 items-center"
            >
              <ChartPie className="h-3.5 w-3.5" />
              <span>{t("analysis.pie")}</span>
            </Button>
            <Button 
              variant={chartType === "bar" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartType("bar")}
              className="flex gap-1 items-center"
            >
              <BarChart4 className="h-3.5 w-3.5" />
              <span>{t("analysis.bar")}</span>
            </Button>
          </div>
        </div>
      </div>
      
      {!hasData ? (
        <div className="bg-muted p-10 rounded-lg text-center">
          <p className="text-muted-foreground">{t("analysis.noData")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("analysis.totalTime")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-medium">
                    {formatTimeWithLocale(Math.floor(totalActual / 60), totalActual % 60)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("analysis.of")} {formatTimeWithLocale(Math.floor(totalPlanned / 60), totalPlanned % 60)} {t("analysis.planned")}
                </p>
              </CardContent>
            </Card>
            
            {mostEfficient && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t("analysis.mostEfficient")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <span className="text-2xl font-medium truncate" title={mostEfficient.name}>
                      {mostEfficient.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPercentWithLocale(mostEfficient.efficiency)} {t("analysis.efficient")}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {leastEfficient && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t("analysis.leastEfficient")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <Trophy className="h-5 w-5 text-muted" />
                    <span className="text-2xl font-medium truncate" title={leastEfficient.name}>
                      {leastEfficient.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPercentWithLocale(leastEfficient.efficiency)} {t("analysis.efficient")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg mb-6">
            <div className="h-[300px]">
              {chartType === "pie" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatTimeWithLocale(Math.floor(Number(value) / 60), Number(value) % 60)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.map(item => ({
                      name: item.name,
                      planned: item.plannedMinutes,
                      actual: item.actualMinutes
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => isArabic ? 
                      `${toLocaleDigits(Math.floor(value / 60).toString(), true)}س` : 
                      `${Math.floor(value / 60)}h`} 
                    />
                    <Tooltip formatter={(value) => formatTimeWithLocale(Math.floor(Number(value) / 60), Number(value) % 60)} />
                    <Legend />
                    <Bar dataKey="planned" name={t("analysis.planned")} fill="#8884d8" />
                    <Bar dataKey="actual" name={t("analysis.actual")} fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">{t("analysis.taskDetails")}</h3>
            <div className="space-y-4">
              {data.map((task) => (
                <Card key={task.name}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium truncate" title={task.name}>{task.name}</h4>
                      <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                        {isArabic ? toLocaleDigits(task.occurrences.toString(), true) : task.occurrences} {t("analysis.occurrences")}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("analysis.planned")}</p>
                        <p className="font-medium">
                          {formatTimeWithLocale(task.planned.hours, task.planned.minutes)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("analysis.actual")}</p>
                        <p className="font-medium">
                          {formatTimeWithLocale(task.actual.hours, task.actual.minutes)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("analysis.efficiency")}</p>
                        <p className="font-medium">
                          {formatPercentWithLocale(task.efficiency)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full transition-all duration-300 ease-in-out"
                        style={{
                          width: `${task.efficiency}%`,
                          backgroundColor: "hsl(var(--primary))",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskAnalysis;
