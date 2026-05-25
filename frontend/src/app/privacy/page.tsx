import { PageShell } from "@/components/layout/page-shell";
import { SITE_CONFIG } from "@/data/internship-domains";

export default function PrivacyPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-sm text-muted-foreground">
        <p>
          {SITE_CONFIG.name} respects your privacy. We collect name, email, and internship data to
          provide our services. We do not sell personal data to third parties.
        </p>
        <p>Contact {SITE_CONFIG.email} for data deletion requests.</p>
      </div>
    </PageShell>
  );
}
