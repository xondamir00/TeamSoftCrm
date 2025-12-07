import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import type { Debtor } from "@/Store/debtor";

interface DebtorFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  minDebt: string;
  setMinDebt: (value: string) => void;
  debtors: Debtor[];
}

export function DebtorFilters({
  search,
  setSearch,
  minDebt,
  setMinDebt,
  debtors,
}: DebtorFiltersProps) {
  
  const exportToExcel = () => {
    if (debtors.length === 0) {
      return;
    }

    try {
      // Ma'lumotlarni Excel formatiga o'tkazish
      const worksheetData = debtors.map((debtor, index) => ({
        '№': index + 1,
        'F.I.Sh': debtor.fullName,
        'Telefon': debtor.phone,
        'Umumiy qarz': debtor.totalDebt,
        'Guruhlar soni': debtor.groups.length,
        'Guruhlar': debtor.groups.map(g => g.name).join(', '),
        'Guruhlar qarzi': debtor.groups.map(g => `${g.name}: ${g.debt}`).join('; '),
      }));

      // Worksheet yaratish
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      
      // Workbook yaratish
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Qarzdorlar");

      // Stil sozlamalari
      const wscols = [
        { wch: 5 },   // №
        { wch: 25 },  // F.I.Sh
        { wch: 15 },  // Telefon
        { wch: 15 },  // Umumiy qarz
        { wch: 15 },  // Guruhlar soni
        { wch: 30 },  // Guruhlar
        { wch: 40 },  // Guruhlar qarzi
      ];
      worksheet['!cols'] = wscols;

      // Excel faylni yuklab olish
      const fileName = `qarzdorlar_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      // Foydalanuvchiga xabar berish
      
    } catch (error) {
      console.error("Excel export error:", error);
    }
  };

  const exportToCSV = () => {
    if (debtors.length === 0) {
      return;
    }

    try {
      // CSV formatga o'tkazish
      const headers = ['№', 'F.I.Sh', 'Telefon', 'Umumiy qarz', 'Guruhlar soni', 'Guruhlar', 'Guruhlar qarzi'];
      const csvData = debtors.map((debtor, index) => [
        index + 1,
        debtor.fullName,
        debtor.phone,
        debtor.totalDebt,
        debtor.groups.length,
        debtor.groups.map(g => g.name).join(', '),
        debtor.groups.map(g => `${g.name}: ${g.debt}`).join('; '),
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Blob yaratish va yuklab olish
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `qarzdorlar_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      
    } catch (error) {
      console.error("CSV export error:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Qarzdorlarni qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <Select value={minDebt} onValueChange={setMinDebt}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Minimal qarz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Barcha qarzdorlar</SelectItem>
              <SelectItem value="100000">100,000+</SelectItem>
              <SelectItem value="500000">500,000+</SelectItem>
              <SelectItem value="1000000">1,000,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={exportToExcel} 
            variant="outline" 
            className="flex-1 md:flex-none"
            disabled={debtors.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          
          <Button 
            onClick={exportToCSV} 
            variant="outline" 
            className="flex-1 md:flex-none"
            disabled={debtors.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>
      
      {debtors.length > 0 && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">{debtors.length} ta qarzdor</span> 
          <span className="mx-2">•</span>
          <span>Jami qarz: {new Intl.NumberFormat('uz-UZ').format(
            debtors.reduce((sum, d) => sum + d.totalDebt, 0)
          )} so'm</span>
        </div>
      )}
    </div>
  );
}