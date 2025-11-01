import AddManagerForm from "../form/AddManeger";
import CreateStudentForm from "../form/addStudent";
import AddTeacherForm from "../form/addTeacher";

const Settings = () => {
  return (
    <div className="my-12 gap-5 grid grid-cols-2 ">
      <AddTeacherForm />
      <CreateStudentForm />
      <AddManagerForm />
    </div>
  );
};

export default Settings;
