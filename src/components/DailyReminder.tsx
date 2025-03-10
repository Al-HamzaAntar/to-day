
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Calendar, Clock, Bell } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { formatDate } from "@/lib/timeUtils";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

interface DailyReminderProps {
  onPlanNow: () => void;
}

const DailyReminder: React.FC<DailyReminderProps> = ({ onPlanNow }) => {
  const { t, language } = useLanguage();
  const { toast: uiToast } = useToast();
  const [open, setOpen] = useState(false);
  const [lastPromptDate, setLastPromptDate] = useState<string | null>(null);
  const [lastHourlyReminder, setLastHourlyReminder] = useState<number | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  // Check if we need to show the daily reminder
  useEffect(() => {
    const storedLastPromptDate = localStorage.getItem('last-prompt-date');
    setLastPromptDate(storedLastPromptDate);

    const today = new Date().toISOString().split('T')[0];
    
    // Show dialog if we haven't prompted today
    if (storedLastPromptDate !== today) {
      setOpen(true);
    }
  }, []);

  // Check notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);
  
  // Setup hourly reminder
  useEffect(() => {
    // Request notification permission if not granted or denied
    if ('Notification' in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
    
    // Function to show hourly reminder
    const checkHourlyReminder = () => {
      const currentHour = new Date().getHours();
      const storedLastHour = localStorage.getItem('last-hourly-reminder');
      const lastHour = storedLastHour ? parseInt(storedLastHour, 10) : null;
      
      // Only show reminder if we're in a new hour and the app is in focus
      if (lastHour !== currentHour && document.visibilityState === 'visible') {
        // Update last hour in local storage
        localStorage.setItem('last-hourly-reminder', currentHour.toString());
        setLastHourlyReminder(currentHour);
        
        // Show toast notification
        toast(t("hourlyReminder.title"), {
          description: t("hourlyReminder.description"),
          duration: 10000, // 10 seconds
          icon: <Bell className="h-5 w-5" />
        });
        
        // Try to show a system notification if permission is granted
        if ('Notification' in window && Notification.permission === "granted") {
          const notification = new Notification(t("hourlyReminder.title"), {
            body: t("hourlyReminder.description"),
            icon: '/favicon.ico'
          });
          
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        }
      }
    };

    // Check immediately and then set up interval
    checkHourlyReminder();
    const intervalId = setInterval(checkHourlyReminder, 60000); // Check every minute
    
    // Visibility change check - to show reminder when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkHourlyReminder();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [t]);

  const handlePlanNow = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('last-prompt-date', today);
    setLastPromptDate(today);
    setOpen(false);
    onPlanNow();
  };

  const handleRemindLater = () => {
    setOpen(false);
  };

  // Format the date according to the language
  const getFormattedDate = () => {
    const date = new Date();
    if (language === 'ar') {
      // For Arabic, use a more locale-appropriate date format
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      return new Intl.DateTimeFormat('ar-SA', options).format(date);
    }
    return formatDate(date);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          toast(t("hourlyReminder.permissionGranted"), {
            description: t("hourlyReminder.notificationsEnabled"),
          });
        }
      });
    }
  };

  const isRtl = language === 'ar';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{t("dailyReminder.title")}</span>
          </DialogTitle>
          <DialogDescription>
            {t("dailyReminder.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Clock className="h-16 w-16 text-primary/80" />
            <h3 className="text-lg font-medium mt-2">{getFormattedDate()}</h3>
            <p className="text-sm text-muted-foreground">
              {t("dailyReminder.prompt")}
            </p>
            
            {notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 flex items-center gap-2"
                onClick={requestNotificationPermission}
              >
                <Bell className="h-4 w-4" />
                {language === 'ar' ? 'تفعيل إشعارات التذكير' : 'Enable Reminder Notifications'}
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className={`flex flex-col sm:flex-row gap-2 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={handleRemindLater}
            className="sm:w-auto w-full"
          >
            {t("dailyReminder.later")}
          </Button>
          <Button 
            onClick={handlePlanNow}
            className="sm:w-auto w-full"
          >
            {t("dailyReminder.planNow")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyReminder;
