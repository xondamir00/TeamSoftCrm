import { Button } from "@/components/ui/button";
import useTeacherStore from "@/Store/teacherStore";
import { useTranslation } from "react-i18next";

export default function TeacherPagination() {
  const { t } = useTranslation();
  
  const { page, totalPages, setPage } = useTeacherStore();

  const handlePrevious = () => {
    setPage(Math.max(page - 1, 1));
  };

  const handleNext = () => {
    setPage(Math.min(page + 1, totalPages));
  };

  return (
    <div className="flex justify-between items-center py-4">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={page === 1}
      >
        {t("previous") || "Previous"}
      </Button>

      <p className="text-sm">
        {t("page") || "Page"} <b>{page}</b> {t("of") || "of"} <b>{totalPages}</b>
      </p>

      <Button
        variant="outline"
        onClick={handleNext}
        disabled={page === totalPages}
      >
        {t("next") || "Next"}
      </Button>
    </div>
  );
}