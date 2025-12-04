"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  onOpenModal: () => void;
}

const EmptyState = ({ onOpenModal }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Hali davomat jadvali mavjud emas
        </h3>
        <p className="text-gray-600 mb-4">
          Birinchi davomat jadvalini yaratish uchun "Yangi Sheet" tugmasini bosing
        </p>
        <Button onClick={onOpenModal}>
          Birinchi Sheetni Yaratish
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;