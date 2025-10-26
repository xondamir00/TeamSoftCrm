import Category from "@/shared/Category";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Category />
    <Link to={'/student'}>
      <Button variant={'outline'}>Students</Button>
    
    </Link>
    </div>
  );
};

export default Home;
