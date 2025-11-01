import { Route, Routes } from "react-router-dom";
import Homelayout from "./components/layout/homelayout";
import Home from "./components/page/home";
import Teacherlayout from "./components/layout/teacherlayout";
import Teacher from "./components/page/Teacher";
import Pupils from "./components/pupils/pupils";
import { Login } from "./components/auth/login";
import { RoleRoute } from "./role/role-route";
import { AuthRefresh } from "./components/auth/Auth-Refresh";
import Settings from "./components/page/settings";
import TeacherList from "./components/teacher/Teacherlist";
import AddTeacherForm from "./components/form/addTeacher";
import CreateStudentForm from "./components/form/addStudent";
import AddManagerForm from "./components/form/AddManeger";
import AddRoom from "./components/Roms/addRoom";
import RoomsList from "./components/Roms/RoomsList";
import AddGroupForm from "./components/Group/AddGoup";
import Groups from "./components/Group/GroupList";

const App = () => {
  return (
    <AuthRefresh>
      <div className="light:bg-[#f2f2f2] h-screen  dark:bg-gray-900">
        <Routes>
          {/* Login sahifasi doim ochiq */}
          <Route path="/sign" element={<Login />} />
          {/* Admin route */}
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <Homelayout />
              </RoleRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="student" element={<Pupils />} />
            <Route path="teachers" element={<TeacherList />} />
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

            <Route path="rooms" element={<RoomsList />} />
            <Route path="groups" element={<Groups />} />
          </Route>

          {/* Teacher route */}
          <Route
            path="/teacher"
            element={
              <RoleRoute roles={["teacher"]}>
                <Teacherlayout />
              </RoleRoute>
            }
          >
            <Route index element={<Teacher />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </AuthRefresh>
  );
};

export default App;
