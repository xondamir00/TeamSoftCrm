"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
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
  XCircle
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/students/${id}`);
      setStudent(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStudent();
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
      day: 'numeric'
    });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>
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

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Button variant="outline" className="shadow-sm">
              <Phone className="w-4 h-4 mr-2" />
              {t("call")}
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md">
              <Mail className="w-4 h-4 mr-2" />
              {t("send_message")}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("personal_information")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {t("phone")}
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
                          {t("address")}
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
                        {t("birth_date")}
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
                        {t("start_date")}
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
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {t("groups")}
                </h2>
                {student.groups && student.groups.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {student.groups.map((group: any, index: number) => (
                      <Badge
                        key={index}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                      >
                        <Star className="w-3 h-3 mr-2 text-yellow-500" />
                        {group.name}
                        {group.course && (
                          <span className="ml-2 text-xs text-blue-600 dark:text-blue-300">
                            ({group.course})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                    {t("no_groups_assigned")}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                  {t("student_stats")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t("attendance_rate")}
                    </span>
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      92%
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t("average_grade")}
                    </span>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      4.8
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t("completed_courses")}
                    </span>
                    <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                      3
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t("upcoming_courses")}
                    </span>
                    <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">
                      1
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
