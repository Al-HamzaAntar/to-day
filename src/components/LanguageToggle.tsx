
import React from "react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="rounded-full font-medium"
      aria-label="Toggle language"
    >
      {language === "en" ? "عربي" : "EN"}
    </Button>
  );
}
