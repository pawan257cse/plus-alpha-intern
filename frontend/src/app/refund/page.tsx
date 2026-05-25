import { PageShell } from "@/components/layout/page-shell";
import { SITE_CONFIG } from "@/data/internship-domains";

export default function RefundPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold">Refund Policy</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-sm text-muted-foreground">
        <p>
          Paid internship enrollments may be refunded within 7 days if no mentor session has
          started. Email {SITE_CONFIG.email} with your enrollment ID.
        </p>
      </div>
    </PageShell>
  );
}
