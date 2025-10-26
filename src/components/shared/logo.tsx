import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={"/"} className="flex items-center space-x-2">
      <div className="text-3xl font-spaceGrotesk font-bold ">CRM</div>
    </Link>
  );
};

export default Logo;