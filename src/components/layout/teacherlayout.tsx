import Navbar from "@/shared/navbar/navbar";
import { Outlet } from "react-router-dom";

const Teacherlayout = () => {
  return (
    <>
  
      <Navbar />
      <Outlet />
    </>
  );
};

export default Teacherlayout;
