import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { pupils } from "@/constants";
import { useTranslation } from "react-i18next";

const Pupils = () => {
  const { t } = useTranslation();
  return (
    <Table>
      <TableCaption>{t("pupils")}</TableCaption>
      <TableHeader>
        <TableRow className="cursor-pointer">
           <TableHead>ID</TableHead>
          <TableHead className="w-[100px]">{t("name")}</TableHead>
          <TableHead>{t("phone")}</TableHead>
          <TableHead>{t("phone2")}</TableHead>
          <TableHead className="text-right">{t("price")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="cursor-pointer">
        {pupils.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.number}</TableCell>
            <TableCell>{item.number2}</TableCell>
            <TableCell className="text-right">{item.payment}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Pupils;
