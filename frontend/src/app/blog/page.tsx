import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";

const posts = [
  { title: "How to Land Your First Tech Internship in 2026", category: "Career", date: "May 20, 2026" },
  { title: "AI Tools Every Student Should Know", category: "AI", date: "May 15, 2026" },
  { title: "Building a Resume That Gets Interviews", category: "Tips", date: "May 10, 2026" },
];

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-20">
        <h1 className="mb-8 text-3xl font-bold">Blog</h1>
        <div className="space-y-4">
          {posts.map((p) => (
            <Card key={p.title} className="cursor-pointer hover:border-violet-500/30">
              <CardContent className="py-6">
                <span className="text-xs text-violet-400">{p.category}</span>
                <h2 className="mt-1 text-xl font-semibold">{p.title}</h2>
                <p className="text-sm text-muted-foreground">{p.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
