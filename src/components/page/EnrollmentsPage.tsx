import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';
import CreateEnrollmentModal from '../Enrollments/CreateEnrollmentModal';

interface Enrollment {
  id: string;
  status: 'ACTIVE' | 'PAUSED' | 'LEFT';
  joinDate: string;
  leaveDate?: string;
  student: {
    id: string;
    fullName: string;
    phone?: string;
  };
  group: {
    id: string;
    name: string;
  };
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/enrollments');
      setEnrollments(res.data.student ?? []);
    } catch (err) {
      console.error(err);
      setError('Enrollmentsni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Enrollmentni o‘chirmoqchimisiz?')) return;
    try {
      await axios.delete(`/enrollments/${id}`);
      fetchEnrollments(); // refresh
    } catch (err) {
      console.error(err);
      setError('O‘chirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <Button onClick={() => setModalOpen(true)}>Yangi Enrollment</Button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Student</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Guruh</th>
              <th className="border p-2">Join Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
  {(enrollments ?? []).map((e) => (
    <tr key={e.id}>
      <td className="border p-2">{e.student.fullName}</td>
      <td className="border p-2">{e.student.phone || '-'}</td>
      <td className="border p-2">{e.group.name}</td>
      <td className="border p-2">{new Date(e.joinDate).toLocaleDateString()}</td>
      <td className="border p-2">{e.status}</td>
      <td className="border p-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(e.id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <CreateEnrollmentModal  
            onClose={() => setModalOpen(false)}
            onSuccess={() => fetchEnrollments()}
          />
        </div>
      )}
    </div>
  );
}
