
import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import TaskAllocation from "@/components/TaskAllocation";
import TaskTracker from "@/components/TaskTracker";
import TimeDisplay from "@/components/TimeDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateActualTotalTime, calculateTotalTime, formatTime } from "@/lib/timeUtils";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("today-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [activeTab, setActiveTab] = useState("allocate");

  useEffect(() => {
    localStorage.setItem("today-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    toast.success("Task added successfully!");
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task removed successfully!");
  };

  const handleUpdateActualTime = (taskId: string, hours: number, minutes: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, actualHours: hours, actualMinutes: minutes }
          : task
      )
    );
    toast.success("Time updated successfully!");
  };

  const totalPlannedTime = calculateTotalTime(tasks);
  const totalActualTime = calculateActualTotalTime(tasks);
  
  const trackedCount = tasks.filter(
    (task) => task.actualHours !== null && task.actualMinutes !== null
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-10 animate-slide-down">
          <h1 className="text-4xl font-bold tracking-tight">Today</h1>
          <p className="text-muted-foreground mt-2">
            Plan and track your 24 hours with simplicity
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="mb-8 p-6 rounded-xl glass dark:glass-dark animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-medium">Tasks Planned</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-medium">{tasks.length}</span>
                  <span className="text-muted-foreground text-sm">
                    {formatTime(totalPlannedTime.hours, totalPlannedTime.minutes)} planned
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-medium">Tasks Tracked</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-medium">{trackedCount}</span>
                  <span className="text-muted-foreground text-sm">
                    {formatTime(totalActualTime.hours, totalActualTime.minutes)} tracked
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-medium">Completion</h3>
                <div className="flex items-center gap-3">
                  <Progress value={trackedCount / Math.max(1, tasks.length) * 100} className="h-2" />
                  <span className="text-sm font-medium">
                    {Math.round(trackedCount / Math.max(1, tasks.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tasks.length > 0 && <TimeDisplay tasks={tasks} />}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="allocate" className="flex-1">Plan Your Day</TabsTrigger>
            <TabsTrigger value="track" className="flex-1">Track Your Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocate" className="pt-2">
            <TaskAllocation
              tasks={tasks}
              onAddTask={handleAddTask}
              onRemoveTask={handleRemoveTask}
            />
          </TabsContent>
          
          <TabsContent value="track" className="pt-2">
            <TaskTracker
              tasks={tasks}
              onUpdateActualTime={handleUpdateActualTime}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
