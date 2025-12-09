import TrashRoomsPage from "@/Featured/Trash/trashroom";
import TrashStudentsPage from "@/Featured/Trash/trashstudents";
import TrashTeacherPage from "@/Featured/Trash/TrashTeacher";

const Trash = () => {
  return (
    <>
      <div className="flex   justify-around flex-wrap">
        <div className="w-[45%]">
          <TrashRoomsPage />
        </div>
        <div className="w-[45%]">
          <TrashStudentsPage />
        </div>
        <div className="w-[45%]">
          <TrashTeacherPage />
        </div>
      </div>
    </>
  );
};

export default Trash;
