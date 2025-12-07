import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Phone, 
  Search, 
  X,
  Loader2 
} from 'lucide-react';
import { usePaymentStore} from '@/Store/finanace/usePaymentStore';
import { formatDate } from '@/Store/finanace/dateUtils';

interface StudentDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export function StudentDropdown({ value, onValueChange, error }: StudentDropdownProps) {
  const {
    selectedStudent,
    filteredStudents,
    isLoadingStudents,
    searchQuery,
    isDropdownOpen,
    selectStudent,
    clearSelectedStudent,
    setDropdownOpen,
    setSearchQuery,
  } = usePaymentStore();

  const handleStudentSelect = (studentId: string) => {
    selectStudent(studentId);
    onValueChange(studentId);
  };

  const handleClearSelection = () => {
    clearSelectedStudent();
    onValueChange('');
  };

  if (selectedStudent) {
    return (
      <div className="relative">
        <div className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {selectedStudent.fullName}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <Phone className="inline w-3 h-3 mr-1" />
                  {selectedStudent.phone}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearSelection}
              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              Telefon: {selectedStudent.phone}
            </Badge>
            {selectedStudent.dateOfBirth && (
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                Tugʻilgan: {formatDate(selectedStudent.dateOfBirth)}
              </Badge>
            )}
            {selectedStudent.startDate && (
              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                Boshlagan: {formatDate(selectedStudent.startDate)}
              </Badge>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="relative">
      <Select
        open={isDropdownOpen}
        onOpenChange={setDropdownOpen}
        value={value}
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
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}