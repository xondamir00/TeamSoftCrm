import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

import { useTranslation } from "react-i18next";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export const SearchBar = ({ search, onSearchChange, onAddClick }: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
      <div className="relative flex-1 sm:max-w-md">
        <label htmlFor="search-input" className="sr-only">
          {t("studentManagement.searchPlaceholder") || "Search by name or phone..."}
        </label>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
        <Input
          id="search-input"
          type="text"
          placeholder={t("studentManagement.searchPlaceholder") || "Search by name or phone..."}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <Button
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-4 h-4" /> {t("studentManagement.addStudent") || "Add Student"}
      </Button>
    </div>
  );
};