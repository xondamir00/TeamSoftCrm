import { Route, Routes } from "react-router-dom"
import Login from "./components/auth/login"
import Homelayout from "./components/layout/homelayout"
import AdminLayout from "./components/layout/adminlayout"
import Teacherlayout from "./components/layout/teacherlayout"

import Home from "./components/page/home"
import Students from "./components/page/Adminpage/StudentsPage"
import Teachers from "./components/page/Adminpage/TeachersPage"
import Groups from "./components/page/Adminpage/GroupsPage"
import Teacher from "./components/page/Teacher"
import GgroupDetail from "./components/teacher/GgroupDetail"
import Pupils from "./components/pupils/pupils"

const App = () => {
  return (
    <div className="light:bg-[#f2f2f2] h-screen dark:bg-gray-900">
      <Routes>
        {/* Public sahifalar */}
        <Route path="/" element={<Homelayout />}>
          <Route index element={<Home />} />
          <Route path="student" element={<Pupils />} />
        </Route>

        {/* Login sahifasi */}
        <Route path="/auth" element={<Login />} />
        <Route path="/sign" element={<Login />} />

        {/* Teacher sahifalari */}
        <Route path="/teacher" element={<Teacherlayout />}>
          <Route index element={<Teacher />} />
          <Route path=":id" element={<GgroupDetail />} />
        </Route>

        {/* Admin panel sahifalari */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="groups" element={<Groups />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
