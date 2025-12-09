import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, FileText, Tag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExpenseStore } from "@/Store/Finanace/expence";
import { ExpenseHeader } from "./ExpenseHeader";
import { ExpenseField } from "./ExpenseField";
import { ExpenseAlert } from "./ExpenseAlert";
import { expenseCategories } from "@/constants";
import {
  expenseSchema,
  type CreateExpenseFormProps,
  type Expense,
  type ExpenseFormData,
} from "@/Store/Finanace/FinanceInterface";

export default function CreateExpenseForm({
  onSuccess,
  initialValues,
}: CreateExpenseFormProps) {
  const { isSubmitting, alertOpen, alertContent, submitExpense, setAlertOpen } =
    useExpenseStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      method: "CASH",
      paidAt: new Date(),
      category: "",
      title: "",
      amount: 0,
      note: "",
      ...initialValues,
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const expenseData: Expense = {
        id: crypto.randomUUID(), // yoki backend dan keladi
        title: data.title,
        category: data.category as Expense["category"], // Type assertion
        amount: data.amount,
        method: data.method,
        note: data.note || undefined,
        paidAt: data.paidAt
          ? data.paidAt.toISOString()
          : new Date().toISOString(),
        recordedById: "current-user-id", // ← Current user ID qo'shing
        recordedByName: "Current User", // ← Current user name
        createdAt: new Date().toISOString(),
      };

      await submitExpense(expenseData);
      // ... qolgan kod
    } catch (error) {
      console.error("Form submit error:", error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-rose-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-rose-200 dark:border-rose-800">
      <ExpenseHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sarlavha */}
        <ExpenseField
          label="Sarlavha"
          htmlFor="title"
          required
          error={errors.title?.message}
        >
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              id="title"
              {...register("title")}
              placeholder="Masalan: Ofis ijara, Kompyuter sotib olish, ..."
              className="h-12 pl-11"
            />
          </div>
        </ExpenseField>

        {/* Kategoriya va Summa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpenseField
            label="Kategoriya"
            htmlFor="category"
            required
            error={errors.category?.message}
          >
            <Select
              onValueChange={(value) => setValue("category", value)}
              value={watch("category")}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Kategoriya tanlang" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ExpenseField>

          <ExpenseField
            label="Summa (soʻm)"
            htmlFor="amount"
            required
            error={errors.amount?.message}
          >
            <div className="relative">
              <Input
                id="amount"
                type="number"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0"
                min="1"
                step="1000"
                className="h-12 pl-12 text-lg font-medium"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span className="text-slate-500 font-semibold">UZS</span>
              </div>
            </div>
          </ExpenseField>
        </div>

        {/* Toʻlov usuli va Sana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpenseField label="Toʻlov usuli" htmlFor="method" required>
            <Select
              onValueChange={(value) => setValue("method", value as any)}
              value={watch("method")}
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
                <SelectItem
                  value="TRANSFER"
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Oʻtkazma
                </SelectItem>
                <SelectItem value="OTHER" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                  Boshqa
                </SelectItem>
              </SelectContent>
            </Select>
          </ExpenseField>

          <ExpenseField label="Toʻlov sanasi" htmlFor="paidAt">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal border-2 hover:border-rose-300 dark:hover:border-rose-600",
                    !watch("paidAt") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("paidAt") ? (
                    format(watch("paidAt")!, "dd.MM.yyyy")
                  ) : (
                    <span>Sana tanlang</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch("paidAt")}
                  onSelect={(date) => setValue("paidAt", date || new Date())}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </ExpenseField>
        </div>

        {/* Izoh */}
        <ExpenseField label="Izoh (ixtiyoriy)" htmlFor="note">
          <Textarea
            id="note"
            {...register("note")}
            placeholder="Xarajat haqida qoʻshimcha maʼlumot..."
            rows={3}
            className="resize-none"
          />
        </ExpenseField>

        <Button
          type="submit"
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r text-white   from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saqlanmoqda...
            </>
          ) : (
            "Chiqimni saqlash"
          )}
        </Button>
      </form>

      <ExpenseAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        alertContent={alertContent}
      />
    </div>
  );
}
