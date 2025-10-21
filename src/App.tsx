import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import Homelayout from "./components/layout/homelayout";
import Home from "./components/page/home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homelayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/auth" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
