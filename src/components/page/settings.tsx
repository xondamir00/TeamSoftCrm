import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { CreateForm } from "@/constants";
import { useTranslation } from "react-i18next";

const TeacherGroup = () => {
  const { t } = useTranslation(); // 🟢 i18next hook

  return (
    <div>
      <div className="mx-auto py-5">
        <h1 className="text-3xl font-bold bg-white text-black dark:text-white dark:bg-[#3F8CFF] text-center rounded-2xl p-3">
          {t("createForms.title")}
        </h1>
      </div>

      <div className="light:bg-white dark:bg-none dark:border-2 border-white p-3 grid grid-cols-2 gap-12 rounded-xl mx-auto">
      {CreateForm.map((item) => (
  <Link key={item.href} to={item.href}>
    <Button
      className="px-12 w-full cursor-pointer py-10 dark:border-2 dark:border-white border-[#3F8CFF] light:text-[#3F8CFF] dark:text-white text-2xl"
      variant={"outline"}
    >
      {t(item.name)} {/* Tarjima kalitdan olinadi */}
    </Button>
  </Link>
))}

      </div>
    </div>
  );
};

export default TeacherGroup;
