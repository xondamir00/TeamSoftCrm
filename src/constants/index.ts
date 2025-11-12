import {
  UserPlus,
  UserCog,
  Building,
  ShieldPlus,
  Users,
  Trash2,
} from "lucide-react";
import { href } from "react-router-dom";

export const CreateForm = [
  {
    name: "createForm.createStudent",
    href: "create-student",
    icon: UserPlus,
  },
  {
    name: "createForm.createTeacher",
    href: "create-teacher",
    icon: UserCog,
  },
  {
    name: "createForm.createRoom",
    href: "create-room",
    icon: Building,
  },
  {
    name: "createForm.createManager",
    href: "create-meneger",
    icon: ShieldPlus,
  },
  {
    name: "createForm.createGroup",
    href: "create-group",
    icon: Users,
  },
  {
    name: "Archive",
    href: "archive",
    icon: Trash2,
  },
  {
    name: "enrollments",
    href: "enrollments",
    icon: Users,
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
