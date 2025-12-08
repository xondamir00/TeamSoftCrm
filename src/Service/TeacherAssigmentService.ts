// Store/teachingAssignmentStore.ts
import { create } from "zustand";
import { api } from "@/Service/api";
import type {  TeachingAssignmentState } from "@/Store/Teacher/TeacherInterface";




const useTeachingAssignmentStore = create<TeachingAssignmentState>((set, get) => ({
  // Initial state
  assignments: [],
  teachers: [],
  groups: [],
  loading: false,
  formLoading: false,
  error: null,
  
  // Setters
  setAssignments: (assignments) => set({ assignments }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTeachers: (teachers) => set({ teachers }),
  setGroups: (groups) => set({ groups }),
  setFormLoading: (formLoading) => set({ formLoading }),
  
  // Fetch all teaching assignments
  fetchAssignments: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get("/teaching-assignments");
      
      set({ 
        assignments: data.items || [], 
        loading: false 
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch teaching assignments";
      set({ 
        error: errorMessage, 
        loading: false,
        assignments: []
      });
      console.error("Error fetching teaching assignments:", err);
    }
  },
  
  // Fetch teachers and groups for form
  fetchFormData: async () => {
    try {
      set({ formLoading: true, error: null });
      
      // Parallel requests for teachers and groups
      const [teachersRes, groupsRes] = await Promise.all([
        api.get("/teachers"),
        api.get("/groups")
      ]);
      
      set({ 
        teachers: teachersRes.data?.items || [],
        groups: groupsRes.data?.items || [],
        formLoading: false 
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch form data";
      set({ 
        error: errorMessage, 
        formLoading: false,
        teachers: [],
        groups: []
      });
      console.error("Error fetching form data:", err);
    }
  },
  
  // Create new teaching assignment with extended payload
  createAssignment: async (payload) => {
    const { assignments } = get();
    set({ loading: true, error: null });
    
    try {
      // Build DTO
      const dto: any = {
        teacherId: payload.teacherId,
        groupId: payload.groupId,
        role: payload.role || "LEAD",
        note: payload.note || undefined,
        inheritSchedule: payload.inheritSchedule !== false,
      };
      
      // Optional date fields
      if (payload.fromDate) dto.fromDate = payload.fromDate;
      if (payload.toDate) dto.toDate = payload.toDate;
      
      // Override fields if not inheriting schedule
      if (!dto.inheritSchedule) {
        dto.daysPatternOverride = payload.daysPatternOverride || undefined;
        dto.startTimeOverride = payload.startTimeOverride || undefined;
        dto.endTimeOverride = payload.endTimeOverride || undefined;
      }
      
      const res = await api.post("/teaching-assignments", dto);
      const newAssignment = res.data;
      
      // Update assignments list
      set({ 
        assignments: [...assignments, newAssignment],
        loading: false 
      });
      
      return newAssignment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create assignment";
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw err;
    }
  },
  
  // Update existing teaching assignment
  updateAssignment: async (id, payload) => {
    const { assignments } = get();
    set({ loading: true, error: null });
    
    try {
      const res = await api.patch(`/teaching-assignments/${id}`, payload);
      const updatedAssignment = res.data;
      
      const updatedAssignments = assignments.map(assignment => 
        assignment.id === id ? { ...assignment, ...updatedAssignment } : assignment
      );
      
      set({ 
        assignments: updatedAssignments,
        loading: false 
      });
      
      return updatedAssignment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update assignment";
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw err;
    }
  },
  
  // Delete teaching assignment
  deleteAssignment: async (id) => {
    const { assignments } = get();
    set({ loading: true, error: null });
    
    try {
      await api.delete(`/teaching-assignments/${id}`);
      
      const updatedAssignments = assignments.filter(assignment => assignment.id !== id);
      
      set({ 
        assignments: updatedAssignments,
        loading: false 
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete assignment";
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw err;
    }
  },
}));

export default useTeachingAssignmentStore;