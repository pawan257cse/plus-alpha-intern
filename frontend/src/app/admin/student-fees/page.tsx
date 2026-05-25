"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, Calendar, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

interface ScheduleRow {
  _id: string;
  name: string;
  email: string;
  fee: number;
  customTaskFee: number | null;
  defaultFee: number;
  paymentDueDate: string | null;
  taskPaymentStatus: string;
  isOverdue: boolean;
}

export default function AdminStudentFeesPage() {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [defaultFee, setDefaultFee] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [csv, setCsv] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState("");
  const [editDue, setEditDue] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/admin/payment-schedule")
      .then(({ data }) => {
        if (data.success) {
          setSchedule(data.data.schedule);
          setDefaultFee(data.data.defaultFee);
          setUpiId(data.data.upiId || "");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    load();
  }, [token, user]);

  const savePlan = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/payment-plan`, {
        customTaskFee: editFee === "" ? undefined : Number(editFee),
        paymentDueDate: editDue || undefined,
        clearCustomFee: editFee === "",
        clearDueDate: !editDue,
      });
      toast.success("Student fee updated");
      setEditingId(null);
      load();
    } catch {
      toast.error("Could not save");
    }
  };

  const bulkLoad = async () => {
    if (!csv.trim()) {
      toast.error("Paste or upload CSV first");
      return;
    }
    setBulkLoading(true);
    try {
      const { data } = await api.post("/admin/payment-plans/bulk", { csv });
      if (data.success) {
        toast.success(`Updated ${data.data.updated} of ${data.data.total} rows`);
        load();
      }
    } catch {
      toast.error("Bulk load failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const onCsvFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result || ""));
    reader.readAsText(file);
  };

  const formatDue = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400">
        <ArrowLeft className="h-4 w-4" /> Admin
      </Link>

      <h1 className="mb-2 text-2xl font-bold">Student Fees & Payment Schedule</h1>
      <p className="mb-6 text-muted-foreground">
        Set individual amounts and due dates. Students see your UPI ID when paying manually.
        Default fee: <strong>₹{defaultFee}</strong>
        {upiId ? (
          <>
            {" "}
            · UPI: <strong>{upiId}</strong>
          </>
        ) : (
          <span className="text-amber-400"> · Add UPI in Fee Settings</span>
        )}
      </p>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" /> Bulk load (CSV)
            </CardTitle>
            <CardDescription>
              Format: email, fee, dueDate — one student per line. Example:
              <code className="mt-1 block text-xs">
                student@email.com,999,2026-06-01
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="file"
              accept=".csv,.txt"
              onChange={(e) => onCsvFile(e.target.files?.[0] ?? null)}
            />
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
              placeholder="Or paste CSV here..."
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
            />
            <Button onClick={bulkLoad} disabled={bulkLoading} className="w-full">
              {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load into system"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Who pays when</CardTitle>
            <CardDescription>
              Sorted by due date. Overdue unpaid fees are highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>
                <Calendar className="mr-1 inline h-4 w-4" />
                Due date = when you expect payment
              </li>
              <li>
                <IndianRupee className="mr-1 inline h-4 w-4" />
                Empty custom fee = default ₹{defaultFee}
              </li>
            </ul>
            <Link href="/admin/settings" className="mt-4 inline-block text-violet-400 hover:underline">
              Edit default fee & UPI →
            </Link>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      ) : schedule.length === 0 ? (
        <p className="text-muted-foreground">No students yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-left">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Fee (₹)</th>
                <th className="p-3">Due date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr
                  key={row._id}
                  className={`border-b border-white/5 ${row.isOverdue ? "bg-red-500/10" : ""}`}
                >
                  <td className="p-3">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                  </td>
                  <td className="p-3">
                    {editingId === row._id ? (
                      <Input
                        type="number"
                        className="h-8 w-24"
                        value={editFee}
                        onChange={(e) => setEditFee(e.target.value)}
                        placeholder={String(row.defaultFee)}
                      />
                    ) : (
                      <>
                        ₹{row.fee}
                        {row.customTaskFee != null && (
                          <span className="ml-1 text-xs text-violet-400">(custom)</span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === row._id ? (
                      <Input
                        type="date"
                        className="h-8"
                        value={editDue}
                        onChange={(e) => setEditDue(e.target.value)}
                      />
                    ) : (
                      formatDue(row.paymentDueDate)
                    )}
                  </td>
                  <td className="p-3 capitalize">{row.taskPaymentStatus}</td>
                  <td className="p-3">
                    {editingId === row._id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => savePlan(row._id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(row._id);
                          setEditFee(
                            row.customTaskFee != null ? String(row.customTaskFee) : ""
                          );
                          setEditDue(
                            row.paymentDueDate
                              ? new Date(row.paymentDueDate).toISOString().slice(0, 10)
                              : ""
                          );
                        }}
                      >
                        Set fee
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
