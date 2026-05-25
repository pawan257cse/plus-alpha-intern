import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-28 pb-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">Student Community</h1>
        <p className="mb-8 text-muted-foreground">
          Discussions, Q&A, and trending posts — sign in to participate.
        </p>
        <Card>
          <CardContent className="py-12">
            <p className="text-muted-foreground">Discussions, comments, and feedback — available in your dashboard.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link href="/login">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link href="/dashboard/community">
                <Button>Open Community</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
