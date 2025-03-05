
import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { TimeUnit } from "@/types";

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
  const [internalValue, setInternalValue] = useState<number>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    const numValue = parseInt(newValue, 10);
    setInternalValue(numValue);
    onChange(numValue);
  };

  return (
    <div className="w-24">
      <Select
        value={internalValue.toString()}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full focus:ring-1 focus:ring-primary/20">
          <SelectValue placeholder={`0 ${unit}`} />
        </SelectTrigger>
        <SelectContent className="max-h-[240px]">
          {Array.from({ length: max + 1 }, (_, i) => (
            <SelectItem 
              key={i} 
              value={i.toString()}
              className="cursor-pointer"
            >
              {i} {unit === "hours" ? (i === 1 ? "hour" : "hours") : (i === 1 ? "minute" : "minutes")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimePicker;
