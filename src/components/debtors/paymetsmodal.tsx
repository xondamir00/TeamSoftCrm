import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CreditCard, Wallet, Banknote, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  studentId: string;
  studentName: string;
  loading: boolean;
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Naqd', icon: Banknote },
  { value: 'CARD', label: 'Karta', icon: CreditCard },
  { value: 'UZUM', label: 'Uzum', icon: Smartphone },
  { value: 'CLICK', label: 'Click', icon: Wallet },
  { value: 'PAYME', label: 'Payme', icon: Smartphone },
  { value: 'TRANSFER', label: 'Bank o\'tkazma', icon: CreditCard },
];

export function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  studentId,
  studentName,
  loading,
}: PaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'CASH',
    reference: '',
    comment: '',
    paidAt: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      studentId,
      amount: Number(formData.amount),
      paidAt: formData.paidAt.toISOString(),
    });
    setFormData({
      amount: '',
      method: 'CASH',
      reference: '',
      comment: '',
      paidAt: new Date(),
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Yangi To'lov
          </DialogTitle>
          <DialogDescription>
            {studentName} uchun to'lovni kiritish
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="amount" className="mb-2 block text-sm font-medium">
                To'lov summasi (UZS)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="text-lg font-semibold py-6"
                required
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">
                To'lov usuli
              </Label>
              <Select
                value={formData.method}
                onValueChange={(value) => handleChange('method', value)}
              >
                <SelectTrigger className="w-full py-6">
                  <SelectValue placeholder="To'lov usulini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{method.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">
                To'lov sanasi
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal py-6",
                      !formData.paidAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.paidAt ? (
                      format(formData.paidAt, "PPP")
                    ) : (
                      <span>Sana tanlang</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.paidAt}
                    onSelect={(date) => handleChange('paidAt', date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="reference" className="mb-2 block text-sm font-medium">
                Referens raqami (ixtiyoriy)
              </Label>
              <Input
                id="reference"
                placeholder="To'lov ID yoki chek raqami"
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="comment" className="mb-2 block text-sm font-medium">
                Izoh (ixtiyoriy)
              </Label>
              <Textarea
                id="comment"
                placeholder="Qo'shimcha ma'lumotlar..."
                value={formData.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={loading || !formData.amount}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kiritilmoqda...
                </>
              ) : (
                'To\'lovni kiritish'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}