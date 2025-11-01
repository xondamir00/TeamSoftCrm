import { Route, Routes } from "react-router-dom";
import Homelayout from "./components/layout/homelayout";
import AdminLayout from "./components/layout/adminlayout";
import Teacherlayout from "./components/layout/teacherlayout";

import Home from "./components/page/home";
import Students from "./components/page/Adminpage/StudentsPage";
import Teachers from "./components/page/Adminpage/TeachersPage";
import Groups from "./components/page/Adminpage/GroupsPage";
import Teacher from "./components/page/Teacher";
import GgroupDetail from "./components/teacher/GgroupDetail";
import Pupils from "./components/pupils/pupils";

import { Login } from "./components/auth/login";
import { RoleRoute } from "./role/role-route";
import { AuthRefresh } from "./components/auth/Auth-Refresh";
import Settings from "./components/page/settings";
import TeacherList from "./components/teacher/Teacherlist";

const App = () => {
  return (
    <AuthRefresh>
      <div className="light:bg-[#f2f2f2] h-screen dark:bg-gray-900">
        <Routes>
          {/* Login sahifalari */}
          <Route path="/auth" element={<Login />} />
          <Route path="/sign" element={<Login />} />

          {/* Public sahifalar */}
          <Route path="/" element={<Homelayout />}>
            <Route index element={<Home />} />
            <Route path="student" element={<Pupils />} />
          </Route>

          {/* Teacher sahifalari */}
          <Route path="/teacher" element={<Teacherlayout />}>
            <Route index element={<Teacher />} />
            <Route path=":id" element={<GgroupDetail />} />
          </Route>

          {/* Admin sahifalari */}
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="groups" element={<Groups />} />
            <Route path="teacherlist" element={<TeacherList />} />
          </Route>
        </Routes>
      </div>
    </AuthRefresh>
  );
};

export default App;
