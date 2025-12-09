import { BsHouseAddFill } from "react-icons/bs";
import { MdAddModerator } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserGraduate } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
export const DAYS_PATTERNS = [
  { value: "ADD", labelKey: "weekdays" },
  { value: "ODD", labelKey: "weekend" },
  { value: "ALL", labelKey: "all_days" },
];
export const expenseCategories = [
  { value: 'SALARY', label: 'Ish haqi' },
  { value: 'RENT', label: 'Ijarа' },
  { value: 'UTILITIES', label: 'Kommunal' },
  { value: 'EQUIPMENT', label: 'Jihozlar va Kompyuterlar' },
  { value: 'OTHER', label: 'Boshqa' },
];
export const CreateForm = [
  {
    nameKey: "assignment_teacher",
    href: "create-assignment",
    icon: FaUserPlus,
  },
  {
    nameKey: "assignment_list",
    href: "assignments",
    icon: GiTeacher,
  },
  {
    nameKey: "add_room",
    href: "create-room",
    icon: BsHouseAddFill,
  },
  {
    nameKey: "add_manager",
    href: "create-manager",
    icon: FaUserTie,
  },
   {
    nameKey: "managerManagement.title",
    href: "menegers-list",
    icon: MdAddModerator,
  },
  {
    nameKey: "student_hub",
    href: "enrollments",
    icon: FaUserGraduate,
  },
  {
    nameKey: "archive",
    href: "archive",
    icon: FaTrashAlt,
  },
];

export const CategoryNavigate = [
  { label: "home", href: "", icon: "/icons/rooms.svg" },
  { label: "groups", href: "groups", icon: "/icons/group.svg" },
  { label: "teachersList", href: "teachers", icon: "/icons/teacher.svg" },
  { label: "studentsList", href: "student", icon: "/icons/student.svg" },
  { label: "debtorsList", href: "debtors", icon: "/icons/debt.svg" },
  { label: "finance", href: "finance", icon: "/icons/finance.svg" },
  { label: "settings", href: "settings", icon: "/icons/settings.svg" },
];

export const pupils = [
  {
    id: "01",
    name: "test",
    number: "1234235",
    number2: "2314234",
    payment: "325 000",
  },
  {
    id: "02",
    name: "test2",
    number: "1234235",
    number2: "2314234",
    payment: "325 000",
  },
  {
    id: "03",
    name: "test3",
    number: "1234235",
    number2: "2314234",
    payment: "325 000",
  },
];
