import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Calendar, User } from "lucide-react";

interface PersonalInfoProps {
  phone: string;
  address?: string;
  dateOfBirth: string;
  startDate: string;
  formatDate: (date: string) => string;
}

export function PersonalInfo({ 
  phone, 
  address, 
  dateOfBirth, 
  startDate, 
  formatDate 
}: PersonalInfoProps) {
  return (
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
                  {phone}
                </span>
              </div>
            </div>

            {address && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Manzil
                </p>
                <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {address}
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
                  {formatDate(dateOfBirth)}
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
                  {formatDate(startDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}