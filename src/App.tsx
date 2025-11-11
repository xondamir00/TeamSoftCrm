import { Route, Routes } from "react-router-dom";
import Homelayout from "./components/layout/homelayout";
import Home from "./components/page/home";
import Teacherlayout from "./components/layout/teacherlayout";
import Teacher from "./components/page/Teacher";
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
import { Login } from "./components/auth/login";
import Student from "./components/pupils/Student";
import TrashRoomsPage from "./components/page/trash";

const App = () => {
  return (
    <AuthRefresh>
      <div className="light:bg-[#f2f2f2] min-h-screen dark:bg-gray-900">
        <Routes>
          <Route path="/sign" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["admin", "ADMIN"]}>
                <Homelayout />
              </RoleRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="student" element={<Student />} />

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
            <Route path="settings/trash" element={<TrashRoomsPage />} />
            <Route path="rooms" element={<RoomsList />} />
            <Route path="groups" element={<Groups />} />
          </Route>

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

          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </AuthRefresh>
  );
};

export default App;
