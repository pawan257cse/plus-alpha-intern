"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const courses = [
  { id: "1", title: "Full Stack Web Development", instructor: "Plus Alpha Team", level: "Intermediate", lessons: 42 },
  { id: "2", title: "Data Science with Python", instructor: "Dr. Sharma", level: "Beginner", lessons: 36 },
  { id: "3", title: "UI/UX Design Masterclass", instructor: "Design Studio", level: "Beginner", lessons: 28 },
];

export default function CoursesPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-20">
        <h1 className="mb-8 text-3xl font-bold">Learn & Get Certified</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="hover:-translate-y-1">
              <CardContent className="pt-6">
                <GraduationCap className="mb-4 h-10 w-10 text-violet-400" />
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.instructor}</p>
                <p className="mt-2 text-xs text-violet-400">{c.level} · {c.lessons} lessons</p>
                <Link href="/signup">
                  <Button className="mt-4 w-full" size="sm">Enroll Free</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
