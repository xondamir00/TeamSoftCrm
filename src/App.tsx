import { Route, Routes } from "react-router-dom";
import Home from "./components/page/home";
import Login from "./components/auth/login";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
