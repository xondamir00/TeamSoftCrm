import CategoryNav from "@/shared/Category";
import Navbar from "@/shared/navbar/navbar";
import { Outlet } from "react-router-dom";

const Homelayout = () => {
  return (
    <div>
      <Navbar />
      <CategoryNav />
      <Outlet />
    </div>
  );
};

export default Homelayout;
