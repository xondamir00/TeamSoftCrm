import { AuthRefresh } from "@/components/auth/Auth-Refresh";
import { Route, Routes } from "react-router-dom";
import { Login } from "@/components/auth/login";
import { RoleRoute } from "@/role/role-route";
import Homelayout from "@/components/layout/homelayout";
import Home from "@/Page/home";
import StudentPage from "@/Featured/Students/StudentFinancepage/StudentPage";
import Teachersettings from "@/Page/Teachersettings";
import ListStudent from "@/Featured/Students/studentList/ListStudent";
import TeacherList from "@/Featured/Teachers/Teacherlist";
import { TeachingAssignmentsList } from "@/Featured/Teachers/TeacherAssignmentsList/TeacherAssignmentsList";
import { TeachingAssignmentForm } from "@/Featured/Teachers/TeacherAssignmentsList/TeacherAssignmentForm";
import AddManagerForm from "@/components/form/AddManeger";
import CreateStudentForm from "@/components/form/addStudent";
import ManagerList from "@/Featured/Maneger/ManagerList";
import AddRoom from "@/Featured/Rooms/AddRoom";
import Trash from "@/Page/trash";
import EnrollmentPage from "@/Page/EnrollmentsPage";
import RoomsList from "@/Featured/Rooms/RoomsList";
import GroupList from "@/Featured/Group/GroupList";
import Debtors from "@/Featured/Debtors/Debtors";
import FinancePage from "@/Page/Finance";
import Teacherlayout from "@/components/layout/teacherlayout";
import MyGroups from "@/Featured/Teachers/TeacherMyGroups";
import Attendancepage from "@/Featured/Attendance/Attendance-page";

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
            <Route index element={<Home />} /> {/* ✅ DEFAULT COMPONENT */}
            <Route path="student/:id" element={<StudentPage />} />
            <Route path="settings" element={<Teachersettings />} />
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
            <Route path="settings/enrollments" element={<EnrollmentPage />} />
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
            <Route index element={<MyGroups />} />
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
