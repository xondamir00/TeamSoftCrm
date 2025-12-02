import TeacherGroup from "../teacher/teacher-group";

const Teacher: React.FC = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="mt-6">
        <TeacherGroup />
      </div>
    </div>
  );
};

export default Teacher;
