
import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  ClipboardList, 
  ClockIcon, 
  BarChart4,
  HelpCircle
} from "lucide-react";

const GettingStartedModal: React.FC = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full" 
          aria-label={t("help.helpButton")}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("gettingStarted.title")}</DialogTitle>
        </DialogHeader>
        
        <div className={`${isArabic ? "font-arabic text-right" : ""}`}>
          <div className="mb-6 space-y-2">
            <p className="text-lg font-medium">{t("gettingStarted.welcome")}</p>
            <p>{t("gettingStarted.intro")}</p>
          </div>
          
          <Tabs defaultValue="plan" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="plan" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>{t("gettingStarted.planTab")}</span>
              </TabsTrigger>
              <TabsTrigger value="track" className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span>{t("gettingStarted.trackTab")}</span>
              </TabsTrigger>
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                <span>{t("gettingStarted.analyzeTab")}</span>
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[400px] px-1">
              <TabsContent value="plan" className="mt-0 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{t("gettingStarted.planHeading")}</h3>
                  <p>{t("gettingStarted.planDesc")}</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">{t("gettingStarted.planStepsHeading")}</h4>
                  <StepItem 
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description={t("gettingStarted.planStep1")}
                  />
                  <StepItem 
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description={t("gettingStarted.planStep2")}
                  />
                  <StepItem 
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description={t("gettingStarted.planStep3")}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="track" className="mt-0 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{t("gettingStarted.trackHeading")}</h3>
                  <p>{t("gettingStarted.trackDesc")}</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">{t("gettingStarted.trackStepsHeading")}</h4>
                  <StepItem 
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description={t("gettingStarted.trackStep1")}
                  />
                  <StepItem 
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description={t("gettingStarted.trackStep2")}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="analyze" className="mt-0 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{t("gettingStarted.analyzeHeading")}</h3>
                  <p>{t("gettingStarted.analyzeDesc")}</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">{t("gettingStarted.analyzeStepsHeading")}</h4>
                  <StepItem 
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description={t("gettingStarted.analyzeStep1")}
                  />
                  <StepItem 
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description={t("gettingStarted.analyzeStep2")}
                  />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleClose}>
              {t("gettingStarted.getStarted")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StepItem: React.FC<{ icon: React.ReactNode; description: string }> = ({
  icon,
  description,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>{description}</div>
    </div>
  );
};

export default GettingStartedModal;
