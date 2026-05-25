import { PageShell } from "@/components/layout/page-shell";
import { InternshipDomains } from "@/components/landing/internship-domains";

export default function DomainsPage() {
  return (
    <PageShell className="!px-0 !pt-0 max-w-none">
      <div className="pt-20">
        <InternshipDomains />
      </div>
    </PageShell>
  );
}
