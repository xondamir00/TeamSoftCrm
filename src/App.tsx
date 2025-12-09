import { Route, Routes } from "react-router-dom";
import Homelayout from "@/components/layout/homelayout";
import Teacherlayout from "@/components/layout/teacherlayout";
import Teacher from "@/Page/Teacher";
import { RoleRoute } from "@/role/role-route";
import { AuthRefresh } from "@/components/auth/Auth-Refresh";
import Settings from "@/Page/Settings";
import AddRoom from "@/Featured/Rooms/AddRoom";
import RoomsList from "@/Featured/Rooms/RoomsList";
import { Login } from "@/components/auth/login";
import ListStudent from "@/Featured/Students/studentList/ListStudent";
import EnrollmentsPage from "@/Page/EnrollmentsPage";
import { TeachingAssignmentForm } from "@/Featured/teacher/TeacherAssignmentsList/TeacherAssignmentForm";
import { TeachingAssignmentsList } from "@/Featured/teacher/TeacherAssignmentsList/TeacherAssignmentsList";
import CreateStudentForm from "@/components/form/addStudent";
import TeacherList from "@/Featured/teacher/Teacherlist";
import AddManagerForm from "@/components/form/AddManeger";
import ManagerList from "@/Featured/Maneger/ManagerList";
import Trash from "@/Page/trash";
import StudentPage from "@/Featured/Students/StudentFinancepage/StudentPage";
import FinancePage from "@/Page/Finance";
import Debtors from "@/Featured/Debtors/Debtors";
import FinanceDashboard from "@/Page/home";
import Attendancepage from "@/Featured/Attendance/Attendance-page";
import GroupList from "@/Featured/Group/GroupList";

const App = () => {
  return (
    <AuthRefresh>
      <div className="bg-white min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
        <Routes>
          {/* Public route */}
          <Route path="/sign" element={<Login />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["admin", "ADMIN", "manager", "MANAGER"]}>
                <Homelayout />
              </RoleRoute>
            }
          >
            <Route index element={<FinanceDashboard />} />{" "}
            {/* ✅ DEFAULT COMPONENT */}
            <Route path="student/:id" element={<StudentPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="student" element={<ListStudent />} />
            <Route path="teachers" element={<TeacherList />} />
            {/* Teaching Assignments routes */}
            <Route
              path="settings/assignments"
              element={<TeachingAssignmentsList />}
            />
            <Route
              path="settings/create-assignment"
              element={<TeachingAssignmentForm onSuccess={() => {}} />}
            />
            {/* Create forms */}
            <Route
              path="settings/create-teacher"
              element={<AddManagerForm />}
            />
            <Route
              path="settings/create-student"
              element={<CreateStudentForm />}
            />
            <Route
              path="settings/create-manager"
              element={<AddManagerForm />}
            />
            <Route path="settings/menegers-list" element={<ManagerList />} />
            <Route path="settings/create-room" element={<AddRoom />} />
            {/* Other admin pages */}
            <Route path="settings/archive" element={<Trash />} />
            <Route path="settings/enrollments" element={<EnrollmentsPage />} />
            <Route path="rooms" element={<RoomsList />} />
            <Route path="groups" element={<GroupList />} />
            <Route path="debtors" element={<Debtors />} />
            <Route path="finance" element={<FinancePage />} />
          </Route>

          {/* Teacher routes */}
          <Route
            path="/teacher"
            element={
              <RoleRoute roles={["teacher", "TEACHER"]}>
                <Teacherlayout />
              </RoleRoute>
            }
          >
            <Route index element={<Teacher />} />
            <Route path="group/:groupId" element={<Attendancepage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </AuthRefresh>
  );
};

export default App;
