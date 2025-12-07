// components/finance/FinanceDashboard.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

import useFinanceStore from '@/Store/financeStore';
import PaymentList from './PaymentList';
import CreatePaymentForm from './CreatePaymentForm';

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    overview, 
    overviewLoading,
    fetchOverview,
    fetchPayments,
    fetchExpenses 
  } = useFinanceStore();

  useEffect(() => {
    fetchOverview();
    fetchPayments();
    fetchExpenses();
  }, [fetchOverview, fetchPayments, fetchExpenses]);

  if (overviewLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 mt-[200px]">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daromad</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.totalIncome.toLocaleString()} soʻm
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiqim</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.totalExpense.toLocaleString()} soʻm
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Foyda</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (overview?.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {overview?.profit.toLocaleString()} soʻm
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To'lovlar</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {useFinanceStore.getState().payments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Umumiy holat</TabsTrigger>
          <TabsTrigger value="payments">To'lovlar</TabsTrigger>
          <TabsTrigger value="expenses">Chiqimlar</TabsTrigger>
          <TabsTrigger value="create-payment">To'lov qo'shish</TabsTrigger>
          <TabsTrigger value="create-expense">Chiqim qo'shish</TabsTrigger>
        </TabsList>

    

        <TabsContent value="payments">
          <PaymentList />
        </TabsContent>


        <TabsContent value="create-payment">
          <CreatePaymentForm />
        </TabsContent>

      
      </Tabs>
    </div>
  );
}