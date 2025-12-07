// components/finance/CreatePaymentForm.tsx
import { useState, useEffect } from 'react';
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
import { CalendarIcon, Loader2, User, Phone, Search, X } from 'lucide-react';
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
import { api } from '@/Service/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Talaba tanlang'),
  amount: z.coerce.number().positive('Summa musbat boʻlishi kerak'),
  method: z.enum(['CASH', 'CARD', 'TRANSFER', 'OTHER']),
  reference: z.string().optional(),
  comment: z.string().optional(),
  paidAt: z.date().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface Student {
  id: string;
  fullName: string;
  phone: string;
  isActive?: boolean;
  dateOfBirth?: string;
  startDate?: string;
}

export default function CreatePaymentForm() {
  const { createPayment } = useFinanceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<Student | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState<{ title: string; description: string }>({ title: '', description: '' });

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
    },
  });

  const selectedStudentId = watch('studentId');

  // Talabalar ro'yxatini yuklash
  useEffect(() => {
    fetchStudents();
  }, []);

  // Talabalar qidiruvini filtr qilish
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  // Tanlangan talaba ma'lumotlarini olish
  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find(s => s.id === selectedStudentId);
      setSelectedStudentDetails(student || null);
    } else {
      setSelectedStudentDetails(null);
    }
  }, [selectedStudentId, students]);

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await api.get('/students', {
        params: {
          limit: 1000,
          isActive: true,
        },
      });

      const items = res.data.items || [];
      setStudents(items);
      setFilteredStudents(items);
    } catch (error) {
      console.error('Talabalar yuklashda xatolik:', error);
      setAlertContent({
        title: 'Xatolik',
        description: 'Talabalar ro\'yxatini yuklashda xatolik yuz berdi'
      });
      setAlertOpen(true);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Belgilanmagan';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Belgilanmagan';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return 'Belgilanmagan';
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      await createPayment({
        ...data,
        paidAt: data.paidAt ? data.paidAt.toISOString() : undefined,
      });
      
      setAlertContent({ 
        title: 'Muvaffaqiyatli', 
        description: 'Toʻlov muvaffaqiyatli qoʻshildi' 
      });
      setAlertOpen(true);
      
      // Formani tozalash
      reset({
        method: 'CASH',
        paidAt: new Date(),
        studentId: '',
        amount: 0,
        reference: '',
        comment: '',
      });
      setSelectedStudentDetails(null);
    } catch (error) {
      console.error('Toʻlov qoʻshishda xatolik:', error);
      setAlertContent({ 
        title: 'Xatolik', 
        description: 'Toʻlov qoʻshishda xatolik yuz berdi' 
      });
      setAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setValue('studentId', studentId);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const clearSelectedStudent = () => {
    setValue('studentId', '');
    setSelectedStudentDetails(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-blue-50 dark:bg-blue-950 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-3 rounded-xl">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Yangi Toʻlov</h2>
          <p className="text-slate-600 dark:text-slate-400">Talabaga toʻlov qoʻshing</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Talaba dropdown */}
        <div className="space-y-2">
          <Label htmlFor="studentId" className="text-slate-700 dark:text-slate-300 font-medium">
            Talaba *
          </Label>
          
          {selectedStudentId && selectedStudentDetails ? (
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {selectedStudentDetails.fullName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        <Phone className="inline w-3 h-3 mr-1" />
                        {selectedStudentDetails.phone}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearSelectedStudent}
                    className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    Telefon: {selectedStudentDetails.phone}
                  </Badge>
                  {selectedStudentDetails.dateOfBirth && (
                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                      Tugʻilgan: {formatDate(selectedStudentDetails.dateOfBirth)}
                    </Badge>
                  )}
                  {selectedStudentDetails.startDate && (
                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                      Boshlagan: {formatDate(selectedStudentDetails.startDate)}
                    </Badge>
                  )}
                </div>
              </div>
              <input type="hidden" {...register('studentId')} />
            </div>
          ) : (
            <div className="relative">
              <Select
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
                value={selectedStudentId}
                onValueChange={handleStudentSelect}
              >
                <SelectTrigger className="w-full h-12 text-left">
                  <SelectValue placeholder="Talabani tanlang yoki qidiring..." />
                </SelectTrigger>
                <SelectContent className="w-full p-0" align="start">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Ism yoki telefon raqami boʻyicha qidiring..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-64">
                    {isLoadingStudents ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-slate-600">Talabalar yuklanmoqda...</span>
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="text-center p-6">
                        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Talaba topilmadi</p>
                        {searchQuery && (
                          <p className="text-sm text-slate-400 mt-1">
                            "{searchQuery}" boʻyicha natija yoʻq
                          </p>
                        )}
                      </div>
                    ) : (
                      filteredStudents.map((student) => (
                        <SelectItem
                          key={student.id}
                          value={student.id}
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <div className="flex items-center gap-3 p-2">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 dark:text-white truncate">
                                {student.fullName}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                <Phone className="inline w-3 h-3 mr-1" />
                                {student.phone}
                              </p>
                            </div>
                            {student.isActive && (
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Faol
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {errors.studentId && (
                <p className="text-sm text-red-500 mt-1">{errors.studentId.message}</p>
              )}
            </div>
          )}
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
                {...register('amount')} 
                placeholder="0" 
                min="1"
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
          className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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

      {/* AlertDialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${alertContent.title === 'Muvaffaqiyatli' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                {alertContent.title === 'Muvaffaqiyatli' ? (
                  <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <AlertDialogTitle className={alertContent.title === 'Muvaffaqiyatli' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
                {alertContent.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel className="rounded-lg">Yopish</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => setAlertOpen(false)}
              className={`rounded-lg ${alertContent.title === 'Muvaffaqiyatli' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}