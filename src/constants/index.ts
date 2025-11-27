import { TiUserAdd } from "react-icons/ti";
import { FaIdBadge } from "react-icons/fa6";
import { BsHouseAddFill } from "react-icons/bs";
import { MdAddModerator } from "react-icons/md";
import { PiTrashSimpleFill } from "react-icons/pi";
import { FaChild } from "react-icons/fa6";

export const CreateForm = [
  {
    nameKey: "assignment_teacher",
    href: "create-assignment",
    icon: TiUserAdd,
  },
  {
    nameKey: "assignment_list",
    href: "assignments",
    icon: FaIdBadge,
  },
  {
    nameKey: "add_room",
    href: "create-room",
    icon: BsHouseAddFill,
  },
  {
    nameKey: "add_manager",
    href: "create-manager",
    icon: MdAddModerator,
  },
   {
    nameKey: "Manager List",
    href: "menegers-list",
    icon: MdAddModerator,
  },
  {
    nameKey: "student_hub",
    href: "enrollments",
    icon: FaChild,
  },
  {
    nameKey: "archive",
    href: "archive",
    icon: PiTrashSimpleFill,
  },
];

export const CategoryNavigate = [
  { label: "home", href: "", icon: "/icons/rooms.svg" },
  { label: "leads", href: "lids", icon: "/icons/users.svg" },
  { label: "groups", href: "groups", icon: "/icons/group.svg" },
  { label: "teachersList", href: "teachers", icon: "/icons/teacher.svg" },
  { label: "studentsList", href: "student", icon: "/icons/student.svg" },
  { label: "debtorsList", href: "debts", icon: "/icons/debt.svg" },
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
