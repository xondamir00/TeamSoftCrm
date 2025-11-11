import { useState } from "react";
import ListStudent from "./ListStudent";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddStudentDrawer from "./AddStudentDrawer";

function Student() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdated = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="relative w-full p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students List</h1>

        <Button
          onClick={() => setOpenDrawer(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Student
        </Button>
      </div>

      <ListStudent
        key={refreshKey}
        onDelete={(student) => setDeleteStudent(student)}
      />

      <AddStudentDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onAdded={handleUpdated}
      />
    </div>
  );
}

export default Student;
