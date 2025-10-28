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
    <div className="w-[98%] mx-auto light:bg-white dark:bg-black shadow-md p-2 border rounded-2xl">
      <div className="md:block overflow-x-auto">
        <Table>
          <TableCaption className="text-xl">{t("pupils")}</TableCaption>

          <TableHeader className="text-xl">
            <TableRow>
              <TableHead>T/r</TableHead>
              <TableHead className="w-[150px]">{t("name")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("phone2")}</TableHead>
              <TableHead className="text-right">{t("price")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
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
      </div>
    </div>
  );
};

export default Pupils;
