import { Route, Routes } from "react-router-dom";
import Homelayout from "./components/layout/homelayout";
import Home from "./components/page/home";
import Teacherlayout from "./components/layout/teacherlayout";
import Teacher from "./components/page/Teacher";
import GgroupDetail from "./components/teacher/GgroupDetail";
import Pupils from "./components/pupils/pupils";
import { Login } from "./components/auth/login";
import { AuthRefresh } from "./components/auth/Auth-Refresh";
import { RoleRoute } from "./components/layout/role-route";

const App = () => {
  return (
    <AuthRefresh>
      <div className="light:bg-[#f2f2f2] h-screen dark:bg-gray-900">
        <Routes>
          {/* 🔓 Login sahifasi doim ochiq */}
          <Route path="/sign" element={<Login />} />

          {/* 🔒 Admin uchun route */}
          <Route
            path="/ADMIN"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <Homelayout />
              </RoleRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="student" element={<Pupils />} />
          </Route>

          {/* 🔒 Teacher uchun route */}
          <Route
            path="/teacher"
            element={
              <RoleRoute roles={["teacher"]}>
                <Teacherlayout />
              </RoleRoute>
            }
          >
            <Route index element={<Teacher />} />
            <Route path=":id" element={<GgroupDetail />} />
          </Route>

          {/* ⚠️ 404 yoki unauthorized */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </AuthRefresh>
  );
};

export default App;
