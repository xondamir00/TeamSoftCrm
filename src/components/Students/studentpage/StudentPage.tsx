"use client";

import { useEffect, useState } from "react";
import { 
  Loader2, 
  ChevronLeft,
  Plus
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentModal } from "@/components/debtors/paymetsmodal";
import { toast } from "sonner";
import { StudentProfile } from "./StudentProfile";
import { PersonalInfo } from "./PersonalInfo";
import { FinanceStats } from "./FinanceStats";
import { PaymentHistory } from "./PaymentHistory";
import { FinanceCards } from "./FinanceCards";
import type { Student, FinanceSummary } from "@/Store/index";
import { api } from "@/Service/api";

const StudentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [financeLoading, setFinanceLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/students/${id}`);
      setStudent(res.data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  const fetchFinanceSummary = async () => {
    if (!id) return;
    setFinanceLoading(true);
    try {
      const res = await api.get(`/finance/students/${id}/summary`);
      setFinance(res.data);
    } catch (error) {
      console.error("Error fetching finance summary:", error);
      toast.error("Moliyaviy ma'lumotlarni yuklashda xatolik");
    } finally {
      setFinanceLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      await api.post('/finance/payments', paymentData);
      toast.success("To'lov muvaffaqiyatli kiritildi!");
      setPaymentModalOpen(false);
      fetchFinanceSummary();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("To'lovni kiritishda xatolik");
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([fetchStudent(), fetchFinanceSummary()]).finally(() => {
        setLoading(false);
      });
    }
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH': return '💵';
      case 'CARD': return '💳';
      case 'UZUM': return '📱';
      case 'CLICK': return '👆';
      case 'PAYME': return '⚡';
      case 'TRANSFER': return '🏦';
      default: return '💰';
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">{t("loading_student")}</p>
        </div>
      </div>
    );

  if (!student)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              {t("student_not_found")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {t("student_not_found_description")}
            </p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("go_back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setPaymentModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              To'lov qo'shish
            </Button>
          </div>
        </div>

        {/* Student Profile */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <StudentProfile 
            student={student}
            studentId={id!}
            getInitials={getInitials}
          />

          {/* Finance Stats */}
          <div className="flex flex-col items-end gap-2">
            {finance && (
              <>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Umumiy balans</p>
                  <p className={`text-3xl font-bold ${finance.debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(finance.totalPaid)}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Qarz</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(finance.debt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Jami hisob</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(finance.totalCharges)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 p-2 shadow-md bg-white dark:bg-transparent border">
            <TabsTrigger value="overview" className="p-2">Umumiy</TabsTrigger>
            <TabsTrigger value="finance" className="p-2">Moliyaviy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Info */}
              <div className="lg:col-span-2">
            <PersonalInfo 
  phone={student.phone}
  address={student.address}
  dateOfBirth={student.dateOfBirth}
  startDate={student.startDate}
  formatDate={formatDate}
/>
              </div>

              {/* Finance Overview */}
              <div>
                <FinanceStats 
                  finance={finance}
                  loading={financeLoading}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <PaymentHistory 
              payments={finance?.lastPayments || []}
              loading={financeLoading}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getPaymentMethodIcon={getPaymentMethodIcon}
            />

            {/* Finance Summary Cards */}
            {finance && (
              <FinanceCards 
                finance={finance}
                formatCurrency={formatCurrency}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Modal */}
    <PaymentModal
  isOpen={paymentModalOpen}
  onClose={() => setPaymentModalOpen(false)}
  onSubmit={handlePaymentSubmit}
  studentId={id!}
  studentName={student?.fullName || ""}
  loading={false}
/>
    </div>
  );
};

export default StudentPage;