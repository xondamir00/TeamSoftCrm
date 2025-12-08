import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { StudentProfileProps } from "@/Store/Student/StudentInterface";
import { Mail, CheckCircle, XCircle, BookOpen } from "lucide-react";

export function StudentProfile({
  student,
  studentId,
  getInitials,
}: StudentProfileProps) {
  return (
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
            className={`px-3 py-1 text-sm ${
              student.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {student.isActive ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Faol
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Nofaol
              </>
            )}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <BookOpen className="w-3 h-3 mr-1" />
            ID: {studentId}
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
  );
}
