
import React from 'react';
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToExcel } from "@/lib/exportUtils";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  tasks: Task[];
}

const ExportButton = ({ tasks }: ExportButtonProps) => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  
  if (tasks.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {isRtl ? (
            <>
              {t("export.button")}
              <Download className="h-4 w-4 mr-1" />
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              {t("export.button")}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={isRtl ? "rtl-content" : ""}>
        <DropdownMenuItem onClick={() => exportToExcel(tasks)}>
          {isRtl ? (
            <>
              <span>{t("export.excel")}</span>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              <span>{t("export.excel")}</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV(tasks)}>
          {isRtl ? (
            <>
              <span>{t("export.csv")}</span>
              <FileText className="h-4 w-4 mr-2" />
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              <span>{t("export.csv")}</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
