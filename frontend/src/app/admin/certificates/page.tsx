"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Award, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<{ _id: string; title: string; verificationId: string; user?: { name: string; email: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ userId: "", title: "" });

  const load = () => {
    api.get("/admin/certificates").then(({ data }) => {
      if (data.success) setCerts(data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const issue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/certificates", form);
      if (data.success) {
        toast.success("Certificate issued");
        setForm({ userId: "", title: "" });
        load();
      }
    } catch {
      toast.error("Issue failed — check user ID");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Award className="h-7 w-7 text-violet-400" />
        Certificate Management
      </h1>

      <Card>
        <CardHeader><CardTitle>Generate certificate</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={issue} className="flex flex-wrap gap-3">
            <div className="space-y-1 flex-1 min-w-[200px]">
              <Label>Student user ID</Label>
              <Input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
            </div>
            <div className="space-y-1 flex-1 min-w-[200px]">
              <Label>Certificate title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <Button type="submit" className="self-end">Issue</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Issued certificates</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          ) : (
            <ul className="space-y-2">
              {certs.map((c) => (
                <li key={c._id} className="rounded-lg border border-white/10 p-3 text-sm">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-muted-foreground">{c.user?.name} · {c.verificationId}</p>
                  <a
                    href={`/certificates/verify/${c.verificationId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    Verify link
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
