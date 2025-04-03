
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";

const HelpGuide: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className={`${isArabic ? "font-arabic text-right" : ""} max-w-4xl mx-auto`}>
      <h2 className="text-2xl font-bold mb-4">{t("help.title")}</h2>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="general" className="flex-1">{t("help.general")}</TabsTrigger>
          <TabsTrigger value="plan" className="flex-1">{t("help.planning")}</TabsTrigger>
          <TabsTrigger value="track" className="flex-1">{t("help.tracking")}</TabsTrigger>
          <TabsTrigger value="analyze" className="flex-1">{t("help.analyzing")}</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[60vh] px-1">
          <TabsContent value="general" className="mt-0">
            <div className="space-y-4">
              <section className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{t("help.welcome")}</h3>
                <p>{t("help.description")}</p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-medium text-lg">{t("help.overview")}</h3>
                <div className="space-y-2">
                  <StepItem number="1" description={t("help.step1")} />
                  <StepItem number="2" description={t("help.step2")} />
                  <StepItem number="3" description={t("help.step3")} />
                </div>
              </section>
              
              <section className="space-y-2">
                <h3 className="font-medium text-lg">{t("help.featuresTitle")}</h3>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside">
                  <li>{t("help.feature1")}</li>
                  <li>{t("help.feature2")}</li>
                  <li>{t("help.feature3")}</li>
                  <li>{t("help.feature4")}</li>
                  <li>{t("help.feature5")}</li>
                </ul>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="plan" className="mt-0">
            <div className="space-y-4">
              <section className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{t("help.planTitle")}</h3>
                <p>{t("help.planDescription")}</p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-medium text-lg">{t("help.howToPlan")}</h3>
                <div className="space-y-2">
                  <StepItem number="1" description={t("help.planStep1")} />
                  <StepItem number="2" description={t("help.planStep2")} />
                  <StepItem number="3" description={t("help.planStep3")} />
                  <StepItem number="4" description={t("help.planStep4")} />
                </div>
              </section>
              
              <section className="space-y-2">
                <h3 className="font-medium text-lg">{t("help.planTips")}</h3>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside">
                  <li>{t("help.planTip1")}</li>
                  <li>{t("help.planTip2")}</li>
                  <li>{t("help.planTip3")}</li>
                </ul>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="track" className="mt-0">
            <div className="space-y-4">
              <section className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{t("help.trackTitle")}</h3>
                <p>{t("help.trackDescription")}</p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-medium text-lg">{t("help.howToTrack")}</h3>
                <div className="space-y-2">
                  <StepItem number="1" description={t("help.trackStep1")} />
                  <StepItem number="2" description={t("help.trackStep2")} />
                  <StepItem number="3" description={t("help.trackStep3")} />
                </div>
              </section>
              
              <section className="space-y-2">
                <h3 className="font-medium text-lg">{t("help.trackTips")}</h3>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside">
                  <li>{t("help.trackTip1")}</li>
                  <li>{t("help.trackTip2")}</li>
                  <li>{t("help.trackTip3")}</li>
                </ul>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="analyze" className="mt-0">
            <div className="space-y-4">
              <section className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{t("help.analyzeTitle")}</h3>
                <p>{t("help.analyzeDescription")}</p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-medium text-lg">{t("help.howToAnalyze")}</h3>
                <div className="space-y-2">
                  <StepItem number="1" description={t("help.analyzeStep1")} />
                  <StepItem number="2" description={t("help.analyzeStep2")} />
                  <StepItem number="3" description={t("help.analyzeStep3")} />
                </div>
              </section>
              
              <section className="space-y-2">
                <h3 className="font-medium text-lg">{t("help.analyzeTips")}</h3>
                <ul className="list-disc list-inside space-y-1 rtl:list-inside">
                  <li>{t("help.analyzeTip1")}</li>
                  <li>{t("help.analyzeTip2")}</li>
                  <li>{t("help.analyzeTip3")}</li>
                </ul>
              </section>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

const StepItem: React.FC<{ number: string; description: string }> = ({
  number,
  description,
}) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 mt-1">
        <CheckCircle2 className="h-5 w-5 text-primary" />
      </div>
      <div>
        <span className="font-medium">
          {isArabic 
            ? `${description}` 
            : `${description}`}
        </span>
      </div>
    </div>
  );
};

export default HelpGuide;
