"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { CONTACT_REASONS, SITE_CONFIG } from "@/data/site-content";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Request received! We'll reply within 24 hours.");
      setLoading(false);
    }, 800);
  };

  return (
    <PageShell>
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Contact</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Get in Touch</h1>
      <p className="mt-4 max-w-2xl pai-subtext">
        Have questions about enrollment, payments, certificates, or college partnerships? Our team
        at {SITE_CONFIG.name} is here to help. {SITE_CONFIG.responseTime}.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Card className="pai-gradient-border">
          <CardHeader>
            <CardTitle className="text-foreground">Request a Callback</CardTitle>
            <CardDescription className="pai-muted">
              Fill the form and we will contact you on email or phone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Your full name" required />
              <Input type="email" placeholder="Email address" required />
              <Input type="tel" placeholder="Phone number (10 digits)" required />
              <select className="pai-input flex h-11 w-full rounded-xl px-4 text-sm text-foreground">
                <option value="">Topic</option>
                {CONTACT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <textarea
                className="pai-input flex min-h-[120px] w-full rounded-xl p-4 text-sm text-foreground"
                placeholder="Your message — domain, payment issue, certificate, etc."
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="flex gap-4 pt-6">
              <MapPin className="h-6 w-6 shrink-0 text-violet-400" />
              <div>
                <p className="font-medium text-foreground">Headquarters</p>
                <p className="text-sm pai-subtext">{SITE_CONFIG.address}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex gap-4 pt-6">
              <Mail className="h-6 w-6 shrink-0 text-violet-400" />
              <div>
                <p className="font-medium text-foreground">Email</p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-violet-300 hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
                <p className="mt-1 text-xs pai-muted">Support: {SITE_CONFIG.supportEmail}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex gap-4 pt-6">
              <Phone className="h-6 w-6 shrink-0 text-violet-400" />
              <div>
                <p className="font-medium text-foreground">Phone / WhatsApp</p>
                <p className="text-sm pai-subtext">{SITE_CONFIG.phone || "Update in site settings"}</p>
                {SITE_CONFIG.whatsapp && (
                  <p className="text-xs pai-muted">WhatsApp: {SITE_CONFIG.whatsapp}</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex gap-4 pt-6">
              <Clock className="h-6 w-6 shrink-0 text-violet-400" />
              <div>
                <p className="font-medium text-foreground">Working Hours</p>
                <p className="text-sm pai-subtext">{SITE_CONFIG.workingHours}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="flex gap-4 pt-6">
              <MessageCircle className="h-6 w-6 shrink-0 text-emerald-400" />
              <div>
                <p className="font-medium text-foreground">Quick Help</p>
                <p className="text-sm pai-subtext">
                  For task submit & payment: login first, then visit Submit Task page. For
                  certificate: use Verify Certificate with your ID.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
