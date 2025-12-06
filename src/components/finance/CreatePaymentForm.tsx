// components/finance/CreatePaymentForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import useFinanceStore from '@/Store/financeStore';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Talaba tanlang'),
  amount: z.coerce.number().positive('Summa musbat boʻlishi kerak'),
  method: z.enum(['CASH', 'CARD', 'TRANSFER', 'OTHER']),
  reference: z.string().optional(),
  comment: z.string().optional(),
  paidAt: z.date().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function CreatePaymentForm() {
  const { createPayment } = useFinanceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState<{ title: string; description: string }>({ title: '', description: '' });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'CASH',
      paidAt: new Date(),
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      await createPayment({
        ...data,
        paidAt: data.paidAt ? data.paidAt.toISOString() : undefined,
      });
      
      setAlertContent({ title: 'Muvaffaqiyatli', description: 'Toʻlov muvaffaqiyatli qoʻshildi' });
      setAlertOpen(true);
    } catch (error) {
      setAlertContent({ title: 'Xatolik', description: 'Toʻlov qoʻshishda xatolik' });
      setAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Yangi Toʻlov</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Talaba */}
        <div className="space-y-2">
          <Label htmlFor="studentId">Talaba</Label>
          <Input id="studentId" {...register('studentId')} placeholder="Talaba ID yoki ismi" />
          {errors.studentId && <p className="text-sm text-red-500">{errors.studentId.message}</p>}
        </div>

        {/* Summa va Toʻlov usuli */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Summa (soʻm)</Label>
            <Input id="amount" type="number" {...register('amount')} placeholder="0" />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">Toʻlov usuli</Label>
            <Select onValueChange={(value) => setValue('method', value as any)} defaultValue="CASH">
              <SelectTrigger>
                <SelectValue placeholder="Tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Naqd</SelectItem>
                <SelectItem value="CARD">Karta</SelectItem>
                <SelectItem value="TRANSFER">Oʻtkazma</SelectItem>
                <SelectItem value="OTHER">Boshqa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sana */}
        <div className="space-y-2">
          <Label>Toʻlov sanasi</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watch('paidAt') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('paidAt') ? format(watch('paidAt')!, 'PPP') : <span>Sana tanlang</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch('paidAt')}
                onSelect={(date) => setValue('paidAt', date || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Referens */}
        <div className="space-y-2">
          <Label htmlFor="reference">Referens (ixtiyoriy)</Label>
          <Input id="reference" {...register('reference')} placeholder="Chek raqami yoki izoh" />
        </div>

        {/* Izoh */}
        <div className="space-y-2">
          <Label htmlFor="comment">Izoh (ixtiyoriy)</Label>
          <Textarea id="comment" {...register('comment')} placeholder="Qoʻshimcha maʼlumot" rows={3} />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Toʻlovni saqlash
        </Button>
      </form>

      {/* AlertDialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertContent.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>Yopish</AlertDialogCancel>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>OK</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
