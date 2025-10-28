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
        <Route path="/auth" element={<Login />} />
        <Route path="/teacher" element={<Teacherlayout />}>
          <Route index element={<Teacher />} />\
          <Route path=":id" element={<GgroupDetail />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
