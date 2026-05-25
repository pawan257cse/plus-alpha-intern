"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Download, ExternalLink, Linkedin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Certificate {
  _id: string;
  title: string;
  verificationId: string;
  issuedAt: string;
  course?: { title: string };
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/certificates/me")
      .then(({ data }) => {
        if (data.success) setCerts(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const shareLinkedIn = (cert: Certificate) => {
    const url = `${window.location.origin}/certificates/verify/${cert.verificationId}`;
    const text = `I earned "${cert.title}" on Plus Alpha Intern! Verify: ${url}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const downloadCert = (cert: Certificate) => {
    const content = `Plus Alpha Intern Certificate\n\nTitle: ${cert.title}\nVerification ID: ${cert.verificationId}\nIssued: ${new Date(cert.issuedAt).toLocaleDateString()}\nVerify: ${window.location.origin}/certificates/verify/${cert.verificationId}`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `certificate-${cert.verificationId}.txt`;
    a.click();
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
        <Award className="h-7 w-7 text-violet-500" />
        My Certificates
      </h1>
      {certs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No certificates yet. Complete courses or get approved by admin to earn one.
          </CardContent>
        </Card>
      ) : (
        certs.map((cert) => (
          <Card key={cert._id}>
            <CardHeader>
              <CardTitle className="text-lg">{cert.title}</CardTitle>
              {cert.course?.title && (
                <p className="text-sm text-muted-foreground">Course: {cert.course.title}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-mono text-sm text-violet-400">{cert.verificationId}</p>
              <p className="text-xs text-muted-foreground">
                Issued {new Date(cert.issuedAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => downloadCert(cert)}>
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
                <Link href={`/certificates/verify/${cert.verificationId}`}>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Verify
                  </Button>
                </Link>
                <Button size="sm" onClick={() => shareLinkedIn(cert)}>
                  <Linkedin className="mr-1 h-4 w-4" />
                  Share on LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
