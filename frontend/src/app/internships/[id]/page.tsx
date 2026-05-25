"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, IndianRupee, Clock, Wifi, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

interface Internship {
  _id: string;
  title: string;
  company: string;
  domain: string;
  location: string;
  stipend: number;
  duration: string;
  isRemote: boolean;
  description: string;
  requirements: string[];
  skills: string[];
}

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/internships/${id}`)
      .then(({ data }) => {
        if (data.success) setInternship(data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const apply = async () => {
    if (!token) {
      router.push(`/login?redirect=/internships/${id}`);
      return;
    }
    setApplying(true);
    try {
      const { data } = await api.post(`/internships/${id}/apply`, {
        coverLetter,
        resumeUrl: user?.resumeUrl,
      });
      if (data.success) {
        toast.success("Application submitted!");
        router.push("/dashboard/internships");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Apply failed";
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      </main>
    );
  }

  if (!internship) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <p>Internship not found</p>
          <Link href="/internships">
            <Button className="mt-4">Back to listings</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-20">
        <Link href="/internships" className="mb-6 inline-flex items-center gap-1 text-sm text-violet-400">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold">{internship.title}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{internship.company}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {internship.location}
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4" /> ₹{internship.stipend}/mo
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {internship.duration}
          </span>
          {internship.isRemote && (
            <span className="flex items-center gap-1 text-violet-400">
              <Wifi className="h-4 w-4" /> Remote
            </span>
          )}
        </div>

        <Card className="mt-8">
          <CardContent className="space-y-4 pt-6">
            <p className="whitespace-pre-wrap text-sm">{internship.description}</p>
            {internship.skills?.length > 0 && (
              <div>
                <p className="text-sm font-medium">Skills</p>
                <p className="text-sm text-muted-foreground">{internship.skills.join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="space-y-4 pt-6">
            <Label>Cover letter (optional)</Label>
            <Input
              className="pai-input"
              placeholder="Why you are a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <Button onClick={apply} disabled={applying} className="w-full sm:w-auto">
              {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply now"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
