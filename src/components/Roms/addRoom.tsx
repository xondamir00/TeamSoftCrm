import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../Service/api";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";

const AddRoom = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number | string>("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    try {
      const { data } = await api.post("/rooms", {
        name,
        capacity: capacity ? Number(capacity) : undefined,
      });

      setMsg(`${t("room_created")}: ${data.name}`);
      setName("");
      setCapacity("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || t("create_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            {t("add_room")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>{t("room_name")}</Label>
              <Input
                placeholder={t("room_name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>{t("capacity_optional")}</Label>
              <Input
                type="number"
                placeholder={t("capacity_placeholder")}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center bg-blue-500 text-white hover:bg-blue-600 justify-center"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("add")}
            </Button>

            {msg && (
              <Alert className="bg-green-50 border-green-300">
                <AlertDescription>{msg}</AlertDescription>
              </Alert>
            )}
            {err && (
              <Alert variant="destructive">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoom;
