"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

export default function VerifyCertificateFormPage() {
  const router = useRouter();
  const [id, setId] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim();
    if (trimmed) router.push(`/certificates/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-md">
        <Card className="gradient-border">
          <CardHeader className="text-center">
            <Award className="mx-auto mb-2 h-12 w-12 text-violet-400" />
            <CardTitle>Verify Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                placeholder="Enter verification ID (e.g. PAI-ABC123)"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
