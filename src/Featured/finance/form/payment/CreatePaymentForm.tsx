import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentStore } from '@/Store/Finanace/UsePaymentStore';
import { PaymentHeader } from './PaymentHeader';
import { StudentDropdown } from './StudentDropdown';
import { PaymentAlert } from './PaymentAlert';

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Talaba tanlang'),
  amount: z.coerce.number().positive('Summa musbat boʻlishi kerak'),
  method: z.enum(['CASH', 'CARD', 'TRANSFER', 'OTHER']),
  reference: z.string().optional(),
  comment: z.string().optional(),
  paidAt: z.date().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface CreatePaymentFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<PaymentFormData>;
}

export default function CreatePaymentForm({ 
  onSuccess, 
  initialValues 
}: CreatePaymentFormProps) {
  const {
    fetchStudents,
    selectedStudent,
    isSubmitting,
    alertOpen,
    alertContent,
    submitPayment,
    resetForm,
    setAlertOpen,
  } = usePaymentStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'CASH',
      paidAt: new Date(),
      studentId: '',
      amount: 0,
      reference: '',
      comment: '',
      ...initialValues,
    },
  });

  const selectedStudentId = watch('studentId');

  // Talabalar ro'yxatini yuklash
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      const paymentData = {
        studentId: data.studentId,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        comment: data.comment,
        paidAt: data.paidAt ? data.paidAt.toISOString() : new Date().toISOString(),
      };

      await submitPayment(paymentData);
      
      // Formani tozalash
      reset({
        method: 'CASH',
        paidAt: new Date(),
        studentId: '',
        amount: 0,
        reference: '',
        comment: '',
      });
      resetForm();
      
      // Yangilash funksiyasini chaqirish
      onSuccess?.();
      
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800">
      <PaymentHeader />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Talaba dropdown */}
        <div className="space-y-2">
          <Label htmlFor="studentId" className="text-slate-700 dark:text-slate-300 font-medium">
            Talaba *
          </Label>
          <StudentDropdown 
            value={selectedStudentId}
            onValueChange={(value) => setValue('studentId', value)}
            error={errors.studentId?.message}
          />
        </div>

        {/* Summa va Toʻlov usuli */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-medium">
              Summa (soʻm) *
            </Label>
            <div className="relative">
              <Input 
                id="amount" 
                type="number" 
                {...register('amount', { valueAsNumber: true })} 
                placeholder="0" 
                min="1"
                step="1000"
                className="h-12 pl-12 text-lg font-medium"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span className="text-slate-500 font-semibold">UZS</span>
              </div>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="method" className="text-slate-700 dark:text-slate-300 font-medium">
              Toʻlov usuli *
            </Label>
            <Select 
              onValueChange={(value) => setValue('method', value as any)} 
              value={watch('method')}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Toʻlov usulini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Naqd
                </SelectItem>
                <SelectItem value="CARD" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Karta
                </SelectItem>
                <SelectItem value="TRANSFER" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Oʻtkazma
                </SelectItem>
                <SelectItem value="OTHER" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                  Boshqa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sana */}
        <div className="space-y-2">
          <Label className="text-slate-700 dark:text-slate-300 font-medium">
            Toʻlov sanasi
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-12 justify-start text-left font-normal border-2 hover:border-blue-300 dark:hover:border-blue-600',
                  !watch('paidAt') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('paidAt') ? format(watch('paidAt')!, 'dd.MM.yyyy') : <span>Sana tanlang</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={watch('paidAt')}
                onSelect={(date) => setValue('paidAt', date || new Date())}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Referens */}
        <div className="space-y-2">
          <Label htmlFor="reference" className="text-slate-700 dark:text-slate-300 font-medium">
            Referens (ixtiyoriy)
          </Label>
          <Input 
            id="reference" 
            {...register('reference')} 
            placeholder="Chek raqami, tranzaksiya ID yoki boshqa maʼlumot" 
            className="h-12"
          />
        </div>

        {/* Izoh */}
        <div className="space-y-2">
          <Label htmlFor="comment" className="text-slate-700 dark:text-slate-300 font-medium">
            Izoh (ixtiyoriy)
          </Label>
          <Textarea 
            id="comment" 
            {...register('comment')} 
            placeholder="Toʻlov haqida qoʻshimcha maʼlumot yozing..." 
            rows={3}
            className="resize-none"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isSubmitting || !selectedStudentId}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Toʻlov amalga oshirilmoqda...
            </>
          ) : (
            'Toʻlovni saqlash'
          )}
        </Button>
      </form>

      <PaymentAlert 
        open={alertOpen} 
        onOpenChange={setAlertOpen}
        alertContent={alertContent}
      />
    </div>
  );
}