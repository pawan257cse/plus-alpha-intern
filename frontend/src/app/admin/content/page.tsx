"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function AdminContentPage() {
  const [blogs, setBlogs] = useState<{ _id: string; title: string; isPublished: boolean }[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Career",
    isPublished: true,
  });

  const load = () => {
    api.get("/admin/blogs").then(({ data }) => {
      if (data.success) setBlogs(data.data || []);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/blogs", form);
      if (data.success) {
        toast.success("Blog published");
        setForm({ title: "", excerpt: "", content: "", category: "Career", isPublished: true });
        load();
      }
    } catch {
      toast.error("Failed to create blog");
    }
  };

  const remove = async (id: string) => {
    await api.delete(`/admin/blogs/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <FileText className="h-7 w-7 text-violet-400" />
        Content Management
      </h1>

      <Card>
        <CardHeader><CardTitle>Add blog post</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-3 max-w-xl">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>Excerpt</Label>
              <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>Content</Label>
              <Input value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <Button type="submit">Publish blog</Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Homepage banners: update hero images in frontend `public/` or site settings.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Blogs</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {blogs.map((b) => (
              <li key={b._id} className="flex justify-between rounded-lg border border-white/10 p-3">
                <span>{b.title} {b.isPublished ? "" : "(draft)"}</span>
                <Button size="sm" variant="outline" onClick={() => remove(b._id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
