"use client";

import { BookOpen, Check, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import type { SheetHeaderProps } from "@/Store/Attendance/Atendens";


const SheetHeader = ({ 
  sheet, 
  stats, 
  onSave, 
  saving 
}: SheetHeaderProps) => {
  return (
    <CardHeader className="bg-gray-50 border-b-2 p-2 dark:border-gray-605 dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <div className="flex justify-between  w-full">
          <CardTitle className="flex items-center gap-2 p-2">
            <BookOpen className="w-5 h-5" />
            {new Date(sheet.date).toLocaleDateString("uz-UZ", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            <span className="text-gray-600">• {sheet.lesson}-dars</span>
          </CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <Badge
              variant={sheet.status === "OPEN" ? "default" : "secondary"}
            >
              {sheet.status === "OPEN" ? "OCHIQ" : "YOPILGAN"}
            </Badge>
            <div className="flex items-center gap-2 text-sm ">
              <Check className="w-4 h-4 text-green-600" />
              <span>{stats.present}</span>
              <X className="w-4 h-4 text-red-600 ml-2" />
              <span>{stats.absent}</span>
              <span className="ml-2  ">Jami: {stats.total}</span>
            </div>
          </div>
        </div>

        {sheet.status === "OPEN" && (
          <div className="flex gap-2">
            <Button
              onClick={() => onSave(sheet.sheetId)}
              disabled={saving}
              className="bg-green-600 text-white mx-2 hover:bg-green-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saqlash
                </>
              )}
            </Button>
        
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default SheetHeader;