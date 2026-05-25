import { PageShell } from "@/components/layout/page-shell";
import { SITE_CONFIG } from "@/data/internship-domains";

export default function TermsPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-sm text-muted-foreground">
        <p>
          By using {SITE_CONFIG.name}, you agree to complete assigned tasks honestly, not share
          login credentials, and follow mentor guidelines during internships.
        </p>
      </div>
    </PageShell>
  );
}
