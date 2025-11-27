import React from "react";
import { Link } from "react-router-dom";
import TeacherGroup from "../form/Createform";

const Teacher: React.FC = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Salom, Teacher!</h1>
      <Link
        to="/teacher/attendance"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Davomat sahifasiga o'tish
      </Link>

      <div className="mt-6">
        <TeacherGroup />
      </div>
    </div>
  );
};

export default Teacher;
