import AddStudent from "./AddStudent";
import ListStudent from "./ListStudent";

function Student() {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 p-6">
      {/* AddStudent chapda (kichikroq) */}
      <div className="w-full lg:w-1/3">
        <AddStudent />
      </div>

      {/* ListStudent o‘ngda (kattaroq) */}
      <div className="w-full lg:w-2/3">
        <ListStudent />
      </div>
    </div>
  );
}

export default Student;
