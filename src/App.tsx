<<<<<<< HEAD
import { Route, Routes } from "react-router-dom"
import Login from "./components/auth/login"
import Homelayout from "./components/layout/homelayout"
import AdminLayout from "./components/layout/adminlayout"
import Home from "./components/page/home"
import Students from "./components/page/Adminpage/StudentsPage"
import Teachers from "./components/page/Adminpage/TeachersPage"
import Groups from "./components/page/Adminpage/GroupsPage"


const App = () => {
  return (
    <Routes>
      {/* Public sahifalar */}
      <Route path="/" element={<Homelayout />}>
        <Route index element={<Home />} />
      </Route>
=======
import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import Homelayout from "./components/layout/homelayout";
import Home from "./components/page/home";
import Teacherlayout from "./components/layout/teacherlayout";
import Teacher from "./components/page/Teacher";
import GgroupDetail from "./components/teacher/GgroupDetail";
import Pupils from "./components/pupils/pupils";

const App = () => {
  return (
    <div className="light:bg-[#f2f2f2] h-screen dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<Homelayout />}>
          <Route index element={<Home />} />
          <Route path="student" element={<Pupils />} />
        </Route>
        <Route path="/sign" element={<Login />} />
        <Route path="/teacher" element={<Teacherlayout />}>
          <Route index element={<Teacher />} />\
          <Route path=":id" element={<GgroupDetail />} />
        </Route>
      </Routes>
    </div>
  );
};
>>>>>>> fbff06d5b5e5f21fbebb7b8f12b72405f048b17a

      <Route path="/auth" element={<Login />} />

      {/* Admin panel sahifalari */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="groups" element={<Groups />} />
      </Route>
    </Routes>
  )
}

export default App
