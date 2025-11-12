import TrashRoomsPage from "../trash/trashroom";
import TrashStudentsPage from "../trash/trashstudents";

const Trash = () => {
  return (
    <>
      <div className="flex  justify-around">
        <div className="w-[45%]">
          <TrashRoomsPage />
        </div>
        <div className="w-[45%]">
          <TrashStudentsPage />
        </div>
      </div>
    </>
  );
};

export default Trash;
