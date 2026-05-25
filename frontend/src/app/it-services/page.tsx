import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Palette, Server, Smartphone } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Modern websites, dashboards, and web apps with React & Next.js.",
  },
  {
    icon: Server,
    title: "Software Solutions",
    description: "Custom ERP, APIs, cloud deployment, and business automation.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Product design, design systems, and conversion-focused interfaces.",
  },
  {
    icon: Smartphone,
    title: "Mobile & Cross-platform",
    description: "Responsive apps and progressive web experiences.",
  },
];

export default function ITServicesPage() {
  return (
    <PageShell>
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">IT Services</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Bespoke digital solutions for startups and enterprises — built by the Plus Alpha team.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <Card key={s.title} className="hover:border-violet-500/30">
            <CardContent className="pt-6">
              <s.icon className="mb-4 h-10 w-10 text-violet-400" />
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/contact">
          <Button size="lg">Request a Callback</Button>
        </Link>
      </div>
    </PageShell>
  );
}
