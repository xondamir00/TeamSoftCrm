"use client";

import { useEffect, useState } from "react";
import { api } from "@/service/api";
import { 
  Loader2, 
  Phone, 
  Calendar, 
  User, 
  BookOpen, 
  ChevronLeft,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  History,
  AlertCircle
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PaymentModal } from "@/components/debtors/paymetsmodal";
import { toast } from "sonner";

interface FinanceSummary {
  studentId: string;
  totalCharges: number;
  totalPaid: number;
  debt: number;
  lastPayments: Array<{
    id: string;
    amount: string;
    method: string;
    status: string;
    paidAt: string;
    comment?: string;
    createdAt: string;
  }>;
}

const StudentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
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
      fetchFinanceSummary(); // Yangilash
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

  const paymentProgress = finance 
    ? Math.min(100, (finance.totalPaid / finance.totalCharges) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br  p-4 md:p-6">
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
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
              {student.avatar ? (
                <AvatarImage src={student.avatar} alt={student.fullName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {getInitials(student.fullName)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                {student.fullName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-3">
                <Badge 
                  variant={student.isActive ? "default" : "secondary"}
                  className={`px-3 py-1 text-sm ${student.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
                >
                  {student.isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t("active")}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      {t("inactive")}
                    </>
                  )}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <BookOpen className="w-3 h-3 mr-1" />
                  ID: {id}
                </Badge>
              </div>
              {student.email && (
                <div className="flex justify-center md:justify-start items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4" />
                  <span>{student.email}</span>
                </div>
              )}
            </div>
          </div>

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 ">
          <TabsList className="grid grid-cols-2 p-2 shadow-md bg-white dark:bg-transparent border ">
            <TabsTrigger value="overview" className="p-2">Umumiy</TabsTrigger>
            <TabsTrigger value="finance" className="p-2">Moliyaviy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Info */}
              <div className="lg:col-span-2">
                <Card className="border-slate-200 p-4 dark:border-slate-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Shaxsiy ma'lumotlar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                            Telefon
                          </p>
                          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {student.phone}
                            </span>
                          </div>
                        </div>

                        {student.address && (
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              Manzil
                            </p>
                            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {student.address}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                            Tug'ilgan sana
                          </p>
                          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {formatDate(student.dateOfBirth)}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                            Qo'shilgan sana
                          </p>
                          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {formatDate(student.startDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Finance Overview */}
              <div>
                <Card className="border-slate-200 p-4 dark:border-slate-700 shadow-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Moliyaviy holat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {financeLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                      </div>
                    ) : finance ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                              To'langan: {formatCurrency(finance.totalPaid)}
                            </span>
                            <span className="font-medium">
                              {paymentProgress.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={paymentProgress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400">To'langan</p>
                            <p className="text-xl font-bold">{formatCurrency(finance.totalPaid)}</p>
                          </div>
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">Qarz</p>
                            <p className="text-xl font-bold">{formatCurrency(finance.debt)}</p>
                          </div>
                        </div>

                        {finance.debt > 0 && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <div className="flex items-center  gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <span className="text-sm text-amber-700 dark:text-amber-400">
                                Talabada {formatCurrency(finance.debt)} miqdorida qarz mavjud
                              </span>
                            </div>
                          </div>
                        )}

                       
                      </>
                    ) : (
                      <p className="text-center text-slate-500 py-8">
                        Moliyaviy ma'lumotlar mavjud emas
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <Card  className="p-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  To'lovlar tarixi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {financeLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                  </div>
                ) : finance && finance.lastPayments.length > 0 ? (
                  <div className="space-y-3">
                    {finance.lastPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-xl">{getPaymentMethodIcon(payment.method)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{formatCurrency(Number(payment.amount))}</p>
                            <p className="text-sm text-slate-500">
                              {formatDate(payment.paidAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}
                            className={
                              payment.status === 'COMPLETED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {payment.status === 'COMPLETED' ? 'To\'langan' : 'Kutilmoqda'}
                          </Badge>
                          <p className="text-sm text-slate-500 mt-1">{payment.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                      To'lovlar mavjud emas
                    </h3>
                    <p className="text-slate-500 mt-2">
                      Talabaning to'lov tarixi bo'sh
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Finance Summary Cards */}
            {finance && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Jami hisob</p>
                        <p className="text-2xl font-bold mt-1">
                          {formatCurrency(finance.totalCharges)}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Jami to'langan</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">
                          {formatCurrency(finance.totalPaid)}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Qoldiq qarz</p>
                        <p className="text-2xl font-bold mt-1 text-red-600">
                          {formatCurrency(finance.debt)}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                        <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Guruhlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.groups && student.groups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {student.groups.map((group: any, index: number) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Badge className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {group.name}
                            </Badge>
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          </div>
                          {group.course && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              Kurs: {group.course}
                            </p>
                          )}
                          {group.schedule && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Jadval: {group.schedule}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                      Guruhlar mavjud emas
                    </h3>
                    <p className="text-slate-500 mt-2">
                      Talaba hozircha hech qanday guruhga biriktirilmagan
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        studentId={id!}
        studentName={student.fullName}
        loading={false}
      />
    </div>
  );
};

export default StudentPage;