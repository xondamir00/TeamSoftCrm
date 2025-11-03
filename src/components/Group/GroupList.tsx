"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useTranslation } from "react-i18next";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import AddGroupForm from "./AddGoup";

interface Group {
  id: string;
  name: string;
  room?: { name: string };
  createdAt: string;
}

export default function GroupList() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("delete_confirm") || "Are you sure?")) return;
    try {
      await api.delete(`/groups/${id}`);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="w-[98%] mx-auto bg-white dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("groups_list")}</h2>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              onClick={() => {
                setEditingGroup(null);
                setDrawerOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="mr-2 w-4 h-4" /> {t("add_group")}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-gray-900 shadow-lg overflow-y-auto">
            <AddGroupForm
              onSuccess={() => {
                setDrawerOpen(false);
                fetchGroups();
              }}
            />
          </DrawerContent>
        </Drawer>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500 text-center">{t("no_groups")}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-2">{t("name")}</th>
              <th className="text-left p-2">{t("room")}</th>
              <th className="text-right p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr
                key={g.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.room?.name || "-"}</td>
                <td className="p-2 text-right flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingGroup(g);
                      setDrawerOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(g.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
