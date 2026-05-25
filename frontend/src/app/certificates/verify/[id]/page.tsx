"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import api from "@/lib/api";

export default function VerifyCertificatePage() {
  const params = useParams();
  const id = params.id as string;
  const [cert, setCert] = useState<{
    valid: boolean;
    title: string;
    verificationId: string;
    issuedAt: string;
    holder?: { name: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/certificates/verify/${id}`)
      .then(({ data }) => {
        if (data.success) setCert(data.data);
      })
      .catch(() => setCert(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="flex min-h-[80vh] items-center justify-center px-4 pt-24">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-md gradient-border">
            <CardHeader className="text-center">
              <Award className="mx-auto mb-4 h-12 w-12 text-violet-400" />
              <CardTitle>Certificate Verification</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {loading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent mx-auto" />
              ) : cert?.valid ? (
                <>
                  <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
                  <p className="text-lg font-semibold text-emerald-400">Valid Certificate</p>
                  <p className="mt-4 font-medium">{cert.title}</p>
                  <p className="text-sm text-muted-foreground">Holder: {cert.holder?.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {cert.verificationId}</p>
                  <p className="text-sm text-muted-foreground">
                    Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <p className="text-lg font-semibold text-red-400">Invalid Certificate</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No certificate found with ID: {id}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
