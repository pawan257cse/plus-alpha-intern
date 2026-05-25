"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Download, ExternalLink, Loader2 } from "lucide-react";
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
                <Button size="sm" onClick={() => shareLinkedIn(cert)} className="bg-[#0077b5] hover:bg-[#0077b5]/90 text-white">
                  <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.203 0 22.225 0z"/>
                  </svg>
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