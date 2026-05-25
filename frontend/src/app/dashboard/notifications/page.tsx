"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get("/users/notifications")
      .then(({ data }) => {
        if (data.success) setItems(data.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    await api.patch(`/users/notifications/${id}/read`);
    setItems((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Bell className="h-7 w-7 text-violet-500" />
        Notifications
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>All alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            items.map((n) => (
              <div
                key={n._id}
                className={`rounded-xl border p-4 ${
                  n.isRead ? "border-white/5 bg-white/5" : "border-violet-500/30 bg-violet-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(n._id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {n.link && (
                  <a href={n.link} className="mt-2 inline-block text-sm text-violet-400 hover:underline">
                    View details →
                  </a>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
