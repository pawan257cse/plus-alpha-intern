"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

interface PaymentRow {
  _id: string;
  amount: number;
  phase: string;
  status: string;
  verificationStatus: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  metadata?: {
    manualTransactionId?: string;
    studentNote?: string;
    proofUrl?: string;
  };
  user: { name: string; email: string; selectedDomain?: string };
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [filter, setFilter] = useState("pending");

  const load = () => {
    api
      .get("/admin/payments", { params: { status: filter === "all" ? undefined : filter } })
      .then(({ data }) => {
        if (data.success) setPayments(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    load();
  }, [token, user, filter]);

  const verify = async (id: string, action: "approve" | "reject") => {
    try {
      await api.patch(`/admin/payments/${id}/verify`, { action });
      toast.success(action === "approve" ? "Payment verified" : "Payment rejected");
      load();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Verify Payments</h1>
        <select
          className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="pending">Pending verification</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      ) : payments.length === 0 ? (
        <p className="text-muted-foreground">No payments in this filter.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <Card key={p._id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{p.user?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{p.user?.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      p.verificationStatus === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : p.verificationStatus === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {p.verificationStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>₹{p.amount}</strong> — {p.phase} payment
                </p>
                <p className="text-muted-foreground">Order: {p.razorpayOrderId}</p>
                {p.razorpayPaymentId && (
                  <p className="text-muted-foreground">Razorpay ID: {p.razorpayPaymentId}</p>
                )}
                {p.metadata?.manualTransactionId && (
                  <p className="text-amber-300">
                    Manual TXN: {p.metadata.manualTransactionId}
                  </p>
                )}
                {p.metadata?.proofUrl && (
                  <a
                    href={
                      p.metadata.proofUrl.startsWith("http")
                        ? p.metadata.proofUrl
                        : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${p.metadata.proofUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    View payment screenshot
                  </a>
                )}
                {p.user?.selectedDomain && (
                  <p className="text-muted-foreground">Domain: {p.user.selectedDomain}</p>
                )}
                {p.verificationStatus === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => verify(p._id, "approve")}>
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => verify(p._id, "reject")}>
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
