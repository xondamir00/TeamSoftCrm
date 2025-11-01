import AddRoom from "../form/addRoom"
import CreateStudentForm from "../form/addStudent"
import AddTeacherForm from "../teacher/addTeacher"

const Settings = () => {
  return (
    <div className=" gap-5 grid grid-cols-2">
                <AddTeacherForm/>
                <CreateStudentForm/>
                <AddRoom/>
    </div>
  )
}

export default Settings