"use client";

import { PaymentPanel } from "@/components/payments/payment-panel";
import Link from "next/link";

export default function DashboardPaymentsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          <span className="pai-brand-text">Plus Alpha Intern</span> — Payments
        </h1>
        <p className="mt-2 text-muted-foreground">
          Registration is free. Pay the full internship fee on{" "}
          <Link href="/submit-task" className="font-medium text-violet-400 underline">
            Submit Task
          </Link>
          .
        </p>
      </div>
      <PaymentPanel phase="registration" />
      <PaymentPanel phase="task" />
    </div>
  );
}
