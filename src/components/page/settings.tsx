import CreateStudentForm from "../form/AddStudent"
import AddTeacherForm from "../teacher/addTeacher"

const Settings = () => {
  return (
    <div className=" gap-5 grid grid-cols-2">
                <AddTeacherForm/>
                <CreateStudentForm/>
    </div>
  )
}

export default Settings