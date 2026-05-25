"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, FileCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const pathways = [
  {
    icon: Briefcase,
    title: "Professional Openings",
    description:
      "For experienced developers & professionals — full-time roles, contract work, and enterprise projects.",
    href: "/careers",
    cta: "View Careers",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    icon: GraduationCap,
    title: "Student Internships",
    description:
      "For ambitious students — hands-on project training, mentors, certificates, and placement support.",
    href: "#domains",
    cta: "Browse Domains",
    gradient: "from-violet-600 to-fuchsia-600",
  },
];

const quickLinks = [
  {
    icon: FileCheck,
    label: "Verify Certificate",
    href: "/certificates/verify",
    description: "Check authenticity of issued certificates",
  },
  {
    icon: Upload,
    label: "Submit Internship Task",
    href: "/submit-task",
    description: "Upload your weekly project or assignment",
  },
];

export function PathwaySection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="grid gap-6 md:grid-cols-2">
          {pathways.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full overflow-hidden">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${p.gradient} p-6`}>
                    <p.icon className="mb-3 h-10 w-10 text-white" />
                    <h3 className="text-xl font-bold text-white">{p.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="mb-6 text-sm text-muted-foreground">{p.description}</p>
                    <Link href={p.href}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        {p.cta}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="cursor-pointer transition-all hover:border-violet-500/30 hover:bg-white/[0.06]">
                <CardContent className="flex items-center gap-4 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15">
                    <link.icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{link.label}</p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
