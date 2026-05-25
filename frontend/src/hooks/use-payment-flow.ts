"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export interface PaymentFees {
  total: number;
  registrationFee: number;
  taskFee: number;
  regPercent: number;
  taskPercent: number;
  payAtTaskOnly: boolean;
  customFeeApplied?: boolean;
}

export interface UpiDetails {
  id: string | null;
  payeeName: string;
  instructions: string;
}

export interface PaymentStatusData {
  registrationPaymentStatus: string;
  taskPaymentStatus: string;
  paymentDueDate: string | null;
  fees: PaymentFees;
  upi: UpiDetails;
}

const loadRazorpay = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay failed to load"));
    document.body.appendChild(script);
  });

export function usePaymentFlow() {
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [status, setStatus] = useState<PaymentStatusData | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get("/payments/my-status")
      .then(({ data }) => {
        if (data.success) setStatus(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const pay = useCallback(
    async (phase: "registration" | "task"): Promise<boolean> => {
      setPaying(true);
      try {
        const { data: orderRes } = await api.post("/payments/create-order", { phase });
        if (!orderRes.success) throw new Error(orderRes.message);

        const { orderId, amount, keyId, manualMode, paymentId, currency } = orderRes.data;

        if (manualMode || !keyId) {
          setPendingPaymentId(paymentId);
          toast.info("Pay via UPI below, then upload proof and transaction ID");
          return false;
        }

        await loadRazorpay();

        return await new Promise<boolean>((resolve) => {
          const rzp = new window.Razorpay!({
            key: keyId,
            amount: amount * 100,
            currency: currency || "INR",
            name: "Plus Alpha Intern",
            description:
              phase === "registration" ? "Registration fee" : "Internship fee — task submission",
            order_id: orderId,
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              await api.post("/payments/confirm", {
                paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success("Payment received! Admin will verify shortly.");
              await reload();
              resolve(true);
            },
            modal: {
              ondismiss: () => resolve(false),
            },
            theme: { color: "#7c3aed" },
          });
          rzp.open();
        });
      } catch {
        toast.error("Payment could not start");
        return false;
      } finally {
        setPaying(false);
      }
    },
    [reload]
  );

  const submitManualProof = useCallback(
    async (transactionId: string, note?: string, proofFile?: File | null) => {
      if (!pendingPaymentId || !transactionId.trim()) {
        toast.error("Enter transaction / UPI reference ID");
        return false;
      }
      setPaying(true);
      try {
        const form = new FormData();
        form.append("paymentId", pendingPaymentId);
        form.append("transactionId", transactionId.trim());
        if (note) form.append("note", note);
        if (proofFile) form.append("proof", proofFile);

        await api.post("/payments/manual-proof", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Submitted for admin verification");
        setPendingPaymentId("");
        await reload();
        return true;
      } catch {
        toast.error("Submit failed");
        return false;
      } finally {
        setPaying(false);
      }
    },
    [pendingPaymentId, reload]
  );

  const taskPaid =
    status?.taskPaymentStatus === "paid" || status?.taskPaymentStatus === "verified";

  const dueDateLabel = status?.paymentDueDate
    ? new Date(status.paymentDueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const isOverdue =
    status?.paymentDueDate &&
    !taskPaid &&
    new Date(status.paymentDueDate) < new Date();

  return {
    loading,
    paying,
    status,
    pendingPaymentId,
    setPendingPaymentId,
    reload,
    pay,
    submitManualProof,
    taskPaid,
    payAtTaskOnly: status?.fees.payAtTaskOnly ?? true,
    dueDateLabel,
    isOverdue,
  };
}
