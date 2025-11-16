import { TiUserAdd } from "react-icons/ti";
import { FaIdBadge } from "react-icons/fa6";
import { BsHouseAddFill } from "react-icons/bs";
import { MdAddModerator } from "react-icons/md";
import { PiTrashSimpleFill } from "react-icons/pi";
import { FaChild } from "react-icons/fa6";




export const CreateForm = [
  {
    name: "Assignment Teacher",
    href: "create-assignment",
    icon: TiUserAdd,
  },
  {
    name: "Assignment List",
    href: "assignments",
    icon: FaIdBadge,
  },
  {
    name: "Add Room",
    href: "create-room",
    icon: BsHouseAddFill,
  },
  {
    name: "Add Manager",
    href: "create-meneger",
    icon: MdAddModerator,
  },
  {
    name: "Student Hub",
    href: "enrollments",
    icon: FaChild,
  }, {
    name: "Archive",
    href: "archive",
    icon: PiTrashSimpleFill,
  },
];


export const CategoryNavigate = [
  { label: "home", href: "", icon: "/icons/rooms.svg" },
  { label: "leads", href: "lids", icon: "/icons/users.svg" },
  { label: "groups", href: "groups", icon: "/icons/group.svg" },
  { label: "teachersList", href: "teachers", icon: "/icons/teacher.svg" },
  { label: "student", href: "student", icon: "/icons/student.svg" },
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
