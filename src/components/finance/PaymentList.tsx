// components/finance/PaymentList.tsx
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import useFinanceStore from '@/Store/financeStore';

export default function PaymentList() {
  const { payments, paymentsLoading, fetchPayments } = useFinanceStore();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchPayments({
      method: methodFilter !== 'all' ? methodFilter as any : undefined,
    });
  }, [methodFilter, fetchPayments]);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(search.toLowerCase()) ||
      payment.comment?.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  const getMethodBadge = (method: string) => {
    const colors = {
      CASH: 'bg-green-100 text-green-800',
      CARD: 'bg-blue-100 text-blue-800',
      TRANSFER: 'bg-purple-100 text-purple-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    
    const labels = {
      CASH: 'Naqd',
      CARD: 'Karta',
      TRANSFER: "O'kazma",
      OTHER: 'Boshqa',
    };
    
    return (
      <Badge className={colors[method as keyof typeof colors] || 'bg-gray-100'}>
        {labels[method as keyof typeof labels] || method}
      </Badge>
    );
  };

  if (paymentsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Talaba, referens yoki izoh boʻyicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Toʻlov usuli" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="CASH">Naqd</SelectItem>
            <SelectItem value="CARD">Karta</SelectItem>
            <SelectItem value="TRANSFER">Oʻtkazma</SelectItem>
            <SelectItem value="OTHER">Boshqa</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtr
        </Button>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sana</TableHead>
              <TableHead>Talaba</TableHead>
              <TableHead>Summa</TableHead>
              <TableHead>Usul</TableHead>
              <TableHead>Referens</TableHead>
              <TableHead>Izoh</TableHead>
              <TableHead>Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Hech qanday toʻlov topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.paidAt), 'dd.MM.yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {payment.studentName || 'Nomaʼlum'}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {payment.amount.toLocaleString()} soʻm
                  </TableCell>
                  <TableCell>{getMethodBadge(payment.method)}</TableCell>
                  <TableCell>{payment.reference || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {payment.comment || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      payment.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {payment.status === 'COMPLETED' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}