import { Route, Routes } from "react-router-dom";
import Homelayout from "./components/layout/homelayout";
import Home from "./components/page/home";
import Teacherlayout from "./components/layout/teacherlayout";
import Teacher from "./components/page/Teacher";
import { RoleRoute } from "./role/role-route";
import { AuthRefresh } from "./components/auth/Auth-Refresh";

import Settings from "./components/page/settings";
import TeacherList from "./components/teacher/Teacherlist";
import AddManagerForm from "./components/form/AddManeger";

import AddRoom from "./components/Roms/addRoom";
import RoomsList from "./components/Roms/RoomsList";

import Groups from "./components/Group/GroupList";

import { Login } from "./components/auth/login";
import ListStudent from "./components/Students/ListStudent";
import EnrollmentsPage from "./components/page/EnrollmentsPage";
import { TeachingAssignmentForm } from "./components/TeachingAssignmentsList/TeachingAssignmentForm";
import { TeachingAssignmentsList } from "./components/TeachingAssignmentsList/TeachingAssignmentsList";
import AddTeacherForm from "./components/teacher/AddTeacherForm";
import CreateStudentForm from "./components/form/addStudent";
import AddGroupForm from "./components/Group/AddGoup";
import Trash from "./components/page/Trash";

const App = () => {
  return (
    <AuthRefresh>
      <div className="light:bg-[#f2f2f2] min-h-screen dark:bg-gray-900">
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
            <Route index element={<Home />} />
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
              element={<AddTeacherForm />}
            />
            <Route
              path="settings/create-student"
              element={<CreateStudentForm />}
            />
            <Route
              path="settings/create-meneger"
              element={<AddManagerForm />}
            />
            <Route path="settings/create-group" element={<AddGroupForm />} />
            <Route path="settings/create-room" element={<AddRoom />} />

            {/* Other admin pages */}
            <Route path="settings/archive" element={<Trash />} />
            <Route path="settings/enrollments" element={<EnrollmentsPage />} />
            <Route path="rooms" element={<RoomsList />} />
            <Route path="groups" element={<Groups />} />
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
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </AuthRefresh>
  );
};

export default App;
