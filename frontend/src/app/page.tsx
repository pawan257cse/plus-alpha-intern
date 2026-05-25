import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustSection } from "@/components/landing/trust-section";
import { InternshipDomains } from "@/components/landing/internship-domains";
import { PathwaySection } from "@/components/landing/pathway-section";
import { WhyInternship } from "@/components/landing/why-internship";
import { ProgramJourney } from "@/components/landing/program-journey";
import { WhatYouGet } from "@/components/landing/what-you-get";
import { PlatformFeatures } from "@/components/landing/platform-features";
import { ForColleges } from "@/components/landing/for-colleges";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <WhatYouGet />
      <TrustSection />
      <InternshipDomains limit={12} />
      <PathwaySection />
      <WhyInternship />
      <ProgramJourney />
      <PlatformFeatures />
      <ForColleges />
      <Testimonials />
      <FAQ />
      <CtaBanner />
      <Footer />
    </main>
  );
}
