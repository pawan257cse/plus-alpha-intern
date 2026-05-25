"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Loader2, Shield, Ban, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  approvedByAdmin?: boolean;
  isVerified?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("student");

  const load = () => {
    api
      .get("/admin/users", { params: { role: roleFilter, limit: 50 } })
      .then(({ data }) => {
        if (data.success) setUsers(data.data.users || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [roleFilter]);

  const verify = async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/verify`);
    if (data.success) {
      toast.success("User verified");
      load();
    }
  };

  const ban = async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/status`, { status: "suspended" });
    if (data.success) {
      toast.success("User banned");
      load();
    }
  };

  const unban = async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/status`, { status: "active" });
    if (data.success) {
      toast.success("User unbanned");
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    const { data } = await api.delete(`/admin/users/${id}`);
    if (data.success) {
      toast.success("User deleted");
      load();
    }
  };

  const approve = async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/approve`, {});
    if (data.success) {
      toast.success("Student approved");
      load();
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Users className="h-7 w-7 text-violet-400" />
        User Management
      </h1>
      <div className="mb-4 flex gap-2">
        {["student", "company", "admin"].map((r) => (
          <Button
            key={r}
            size="sm"
            variant={roleFilter === r ? "default" : "outline"}
            onClick={() => setRoleFilter(r)}
          >
            {r}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-violet-500" />
          ) : (
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u._id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 p-3"
                >
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <p className="text-xs capitalize text-violet-400">
                      {u.role} · {u.status}
                      {u.approvedByAdmin && " · approved"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {!u.isVerified && (
                      <Button size="sm" variant="outline" onClick={() => verify(u._id)}>
                        <Shield className="h-3 w-3" />
                      </Button>
                    )}
                    {u.role === "student" && !u.approvedByAdmin && (
                      <Button size="sm" onClick={() => approve(u._id)}>
                        Approve
                      </Button>
                    )}
                    {u.status === "suspended" ? (
                      <Button size="sm" variant="outline" onClick={() => unban(u._id)}>
                        Unban
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => ban(u._id)}>
                        <Ban className="h-3 w-3" />
                      </Button>
                    )}
                    {u.role !== "admin" && (
                      <Button size="sm" variant="destructive" onClick={() => remove(u._id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
