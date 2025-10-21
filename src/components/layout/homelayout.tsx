import Navbar from "@/shared/navbar";
import { Outlet } from "react-router-dom";

const Homelayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Homelayout;
