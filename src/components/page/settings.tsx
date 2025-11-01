// import AddManagerForm from "../form/AddManeger";
// import AddRoom from "../form/addRoom";
// import CreateStudentForm from "../form/addStudent";
// import AddTeacherForm from "../form/addTeacher";

import TeacherGroup from "../form/Createform";

const Settings = () => {
  return (
    <div className="flex items-center  justify-center ">
      {/* <AddTeacherForm />
      <CreateStudentForm />
      <AddManagerForm />
      <AddRoom /> */}
      <div className="w-[50%] bg-white shadow-md my-5 rounded-2xl border">
        <TeacherGroup />
      </div>
    </div>
  );
};

export default Settings;
