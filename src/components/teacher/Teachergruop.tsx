import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Guruhlar } from "@/constants";

const TeacherGroup = () => {
  return (
    <div>
      <div className="w-[60%] mx-auto p-5">
        <h1 className="text-4xl font-bold bg-white text-black  dark:text-white dark:bg-[#3F8CFF] text-center  rounded-2xl p-3">
          Guruhlar
        </h1>
      </div>
      <div className="w-[58%] light:bg-white dark:bg-none dark:border-2 border-white  p-3 grid grid-cols-2 gap-6 rounded-2xl  mx-auto">
        {Guruhlar.map((item) => (
          <Link key={item.id} to={`${item.id}`}>
            <Button
              className="px-12 w-full cursor-pointer py-6 dark:border-2 dark:border-white border-[#3F8CFF] light:text-[#3F8CFF] dark:text-white text-2xl"
              variant={"outline"}
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeacherGroup;
