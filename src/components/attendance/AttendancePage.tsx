// AttendancePage.tsx
"use client";

import { useState, useEffect } from "react";
import { formatISO } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

import { api } from "@/Service/api"; // global axios instance

interface OpenSheetDto {
  groupId: string;
  date: string; // ISO string
  teacherAssignId?: string;
  note?: string;
}

interface MarkItemDto {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  note?: string;
}

interface MarkAttendanceDto {
  items: MarkItemDto[];
  lock: boolean;
}

interface Sheet {
  id: string;
  groupId: string;
  date: string;
  isLocked: boolean;
  attendance: MarkItemDto[];
}

interface Group {
  id: string;
  name: string;
}

export default function AttendancePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [date, setDate] = useState<string>(
    formatISO(new Date(), { representation: "date" })
  );
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await api.get("/groups");
        console.log("groups data:", data);

        // items arrayini olish
        const groupsArray = Array.isArray(data.items) ? data.items : [];
        setGroups(groupsArray);

        // birinchi groupni selectedGroup qilamiz
        if (groupsArray.length > 0) {
          setSelectedGroup(groupsArray[0].id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching groups");
      }
    };

    fetchGroups();
  }, []);

  // fetch sheets
  const fetchSheets = async () => {
    if (!selectedGroup) return;
    try {
      setLoading(true);
      const { data } = await api.get<Sheet[]>("/attendance/sheets", {
        params: { groupId: selectedGroup },
      });
      setSheets(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching sheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGroup) fetchSheets();
  }, [selectedGroup]);

  // open new sheet
  const openSheet = async () => {
    if (!selectedGroup) return;
    try {
      await api.post("/attendance/open-sheet", {
        groupId: selectedGroup,
        date,
      } as OpenSheetDto);
      toast.success("Sheet opened successfully");
      fetchSheets();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error opening sheet");
    }
  };

  // mark attendance
  const markAttendance = async (sheetId: string, items: MarkItemDto[]) => {
    try {
      const dto: MarkAttendanceDto = { items, lock: false };
      await api.patch(`/attendance/${sheetId}/mark`, dto);
      toast.success("Attendance updated");
      fetchSheets();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error marking attendance");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      <div className="flex gap-4 mb-4">
        <select
          className="border rounded px-2 py-1"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Button onClick={openSheet}>Open Sheet</Button>
      </div>

      {loading && <p>Loading sheets...</p>}

      <div className="grid gap-4">
        {sheets.map((sheet) => (
          <Card key={sheet.id}>
            <CardHeader>
              <CardTitle>
                {sheet.date} - {sheet.isLocked ? "Locked" : "Open"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sheet.attendance.length === 0 ? (
                <p>No attendance yet</p>
              ) : (
                <table className="w-full text-left border">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Student</th>
                      <th className="border px-2 py-1">Status</th>
                      <th className="border px-2 py-1">Note</th>
                      <th className="border px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.attendance.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{item.studentId}</td>
                        <td className="border px-2 py-1">{item.status}</td>
                        <td className="border px-2 py-1">{item.note || "-"}</td>
                        <td className="border px-2 py-1">
                          {!sheet.isLocked && (
                            <Button
                              size="sm"
                              onClick={() =>
                                markAttendance(sheet.id, [
                                  { ...item, status: "PRESENT" },
                                ])
                              }
                            >
                              Mark Present
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
