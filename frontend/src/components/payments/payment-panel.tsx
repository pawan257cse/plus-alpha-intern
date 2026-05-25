"use client";

import { Loader2, IndianRupee, ShieldCheck, Sparkles, Copy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePaymentFlow } from "@/hooks/use-payment-flow";
import { useState } from "react";
import { toast } from "sonner";

export function PaymentPanel({
  phase,
  hideIfFree = true,
}: {
  phase: "registration" | "task";
  hideIfFree?: boolean;
}) {
  const {
    loading,
    paying,
    status,
    pendingPaymentId,
    pay,
    submitManualProof,
    payAtTaskOnly,
    dueDateLabel,
    isOverdue,
  } = usePaymentFlow();
  const [manualId, setManualId] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);

  const copyUpi = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("UPI ID copied");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!status) return null;

  if (phase === "registration" && payAtTaskOnly && hideIfFree) {
    return (
      <Card className="pai-gradient-border border-violet-500/20">
        <CardContent className="flex items-start gap-3 pt-6">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
          <div>
            <p className="font-semibold text-foreground">Registration is free</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pay the internship fee (₹{status.fees.taskFee}
              {status.fees.customFeeApplied ? " — your assigned amount" : ""}) when you submit your
              final task.
              {dueDateLabel && (
                <>
                  {" "}
                  Due by: <strong>{dueDateLabel}</strong>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const phaseStatus =
    phase === "registration"
      ? status.registrationPaymentStatus
      : status.taskPaymentStatus;
  const amount =
    phase === "registration" ? status.fees.registrationFee : status.fees.taskFee;
  const percent =
    phase === "registration" ? status.fees.regPercent : status.fees.taskPercent;

  const statusLabel =
    phaseStatus === "verified"
      ? { text: "Verified by admin", color: "text-emerald-400" }
      : phaseStatus === "paid"
        ? { text: "Paid — pending admin verification", color: "text-fuchsia-400" }
        : { text: "Not paid", color: "text-muted-foreground" };

  const upi = status.upi;

  return (
    <Card className="pai-gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <IndianRupee className="h-5 w-5 text-violet-400" />
          {phase === "registration" ? "Registration Payment" : "Task Submission Fee"}
        </CardTitle>
        <CardDescription>
          {payAtTaskOnly && phase === "task" ? (
            <>
              Amount due: <strong>₹{amount}</strong>
              {status.fees.customFeeApplied && " (set by admin for you)"}
            </>
          ) : (
            <>
              {percent}% of total (₹{status.fees.total}) — <strong>₹{amount}</strong>
            </>
          )}
        </CardDescription>
        {dueDateLabel && phase === "task" && (
          <p
            className={`flex items-center gap-1 text-sm ${isOverdue ? "text-red-400" : "text-muted-foreground"}`}
          >
            <Calendar className="h-4 w-4" />
            {isOverdue ? "Overdue — " : "Pay by: "}
            {dueDateLabel}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className={`text-sm font-medium ${statusLabel.color}`}>
          <ShieldCheck className="mr-1 inline h-4 w-4" />
          {statusLabel.text}
        </p>

        {phaseStatus === "unpaid" && !pendingPaymentId && (
          <Button onClick={() => pay(phase)} disabled={paying} className="w-full">
            {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay ₹${amount} now`}
          </Button>
        )}

        {pendingPaymentId && (
          <div className="space-y-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
            {upi?.id ? (
              <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
                <p className="font-medium text-violet-300">Pay via UPI (admin account)</p>
                <p className="mt-1 text-muted-foreground">{upi.payeeName}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <code className="text-base font-semibold text-foreground">{upi.id}</code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copyUpi(upi.id!)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{upi.instructions}</p>
                <p className="mt-2 font-medium">Amount: ₹{amount}</p>
              </div>
            ) : (
              <p className="text-sm text-amber-300">
                Admin has not set a UPI ID yet. Contact support after paying.
              </p>
            )}

            <p className="text-sm">After paying, upload screenshot and enter transaction ID:</p>
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
            />
            <Input
              placeholder="Transaction ID / UPI reference"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
            <Input
              placeholder="Note (optional)"
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
            />
            <Button
              onClick={() => submitManualProof(manualId, manualNote, proofFile)}
              disabled={paying}
              className="w-full"
            >
              Submit for verification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
