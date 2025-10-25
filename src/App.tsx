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
