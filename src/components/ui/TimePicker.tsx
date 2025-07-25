
import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { TimeUnit } from "@/types";
import { useLanguage } from "../LanguageProvider";
import { toLocaleDigits } from "@/lib/formatUtils";

interface TimePickerProps {
  value: number;
  onChange: (value: number) => void;
  unit: TimeUnit;
  max?: number;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange, 
  unit, 
  max = unit === "hours" ? 24 : 59,
  disabled = false
}) => {
  const { language } = useLanguage();
  const [internalValue, setInternalValue] = useState<number>(value);
  const isArabic = language === "ar";

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    const numValue = parseInt(newValue, 10);
    setInternalValue(numValue);
    onChange(numValue);
  };

  const getUnitLabel = (unit: TimeUnit, value: number) => {
    const valueStr = toLocaleDigits(value, isArabic);
    
    if (!isArabic) {
      return `${value} ${unit === "hours" ? (value === 1 ? "hour" : "hours") : (value === 1 ? "minute" : "minutes")}`;
    } else {
      // Arabic labels
      if (unit === "hours") {
        return `${valueStr} ${value === 1 ? "ساعة" : value === 2 ? "ساعتان" : "ساعات"}`;
      } else {
        return `${valueStr} ${value === 1 ? "دقيقة" : value === 2 ? "دقيقتان" : "دقائق"}`;
      }
    }
  };

  return (
    <div className="w-24">
      <Select
        value={internalValue.toString()}
        onValueChange={handleChange}
        disabled={disabled}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <SelectTrigger className="w-full focus:ring-1 focus:ring-primary/20">
          <SelectValue placeholder={`${isArabic ? toLocaleDigits(0, true) : "0"} ${unit}`} />
        </SelectTrigger>
        <SelectContent className="max-h-[240px]">
          {Array.from({ length: max + 1 }, (_, i) => (
            <SelectItem 
              key={i} 
              value={i.toString()}
              className="cursor-pointer"
            >
              {getUnitLabel(unit, i)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimePicker;
