"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author?: { name: string };
  comments: { content: string; createdAt: string; user?: { name: string } }[];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const load = () => {
    api
      .get("/community")
      .then(({ data }) => {
        if (data.success) setPosts(data.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post("/community", newPost);
      if (data.success) {
        toast.success("Discussion posted!");
        setNewPost({ title: "", content: "" });
        load();
      }
    } catch {
      toast.error("Failed to post");
    } finally {
      setCreating(false);
    }
  };

  const addComment = async (postId: string) => {
    const content = commentText[postId]?.trim();
    if (!content) return;
    try {
      const { data } = await api.post(`/community/${postId}/comments`, { content });
      if (data.success) {
        setCommentText((prev) => ({ ...prev, [postId]: "" }));
        load();
      }
    } catch {
      toast.error("Comment failed");
    }
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
        <MessageSquare className="h-7 w-7 text-violet-500" />
        Community
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Start a discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createPost} className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                className="pai-input"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Input
                className="pai-input"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {posts.map((post) => (
        <Card key={post._id}>
          <CardHeader>
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {post.author?.name} · {new Date(post.createdAt).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{post.content}</p>
            <div className="space-y-2 border-t border-white/10 pt-4">
              <p className="text-xs font-medium text-muted-foreground">Comments</p>
              {post.comments?.length ? (
                post.comments.map((c, i) => (
                  <div key={i} className="rounded-lg bg-white/5 p-2 text-sm">
                    <p className="font-medium text-xs">{c.user?.name || "Student"}</p>
                    <p>{c.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No comments yet</p>
              )}
              <div className="flex gap-2">
                <Input
                  className="pai-input flex-1"
                  placeholder="Add feedback or comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))
                  }
                />
                <Button size="icon" onClick={() => addComment(post._id)}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
