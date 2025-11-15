// src/components/enrollments/EnrollmentsTable.tsx
"use client";


export default function EnrollmentsTable({ list }) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Group</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Start Date</th>
          </tr>
        </thead>

        <tbody>
          {list?.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-3">
                {e.student?.firstName} {e.student?.lastName}
              </td>
              <td className="p-3">{e.group?.name}</td>
              <td className="p-3">{e.status}</td>
              <td className="p-3">{e.startDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {list?.length === 0 && (
        <p className="text-center py-4 text-gray-500">No enrollments found</p>
      )}
    </div>
  );
}
