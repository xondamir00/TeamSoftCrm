import TrashRoomsPage from "../components/trash/trashroom";
import TrashStudentsPage from "../components/trash/trashstudents";
import TrashTeacherPage from "../components/trash/TrashTeacher";

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
