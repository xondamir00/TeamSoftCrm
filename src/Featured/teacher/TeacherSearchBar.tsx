import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTeacherStore from "@/Service/TeacherService";

export default function TeacherSearchBar() {
  const { t } = useTranslation();

  const { search, setSearch, setOpenAddDrawer } = useTeacherStore();

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={t("search_placeholder") || "Search by name or phone..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button
        onClick={() => setOpenAddDrawer(true)}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {t("add_teacher") || "Add Teacher"}
      </Button>
    </div>
  );
}
