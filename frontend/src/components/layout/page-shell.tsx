import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";

export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main>
      <Navbar />
      <div className={`mx-auto max-w-7xl px-4 pt-28 pb-20 md:pt-32 ${className}`}>{children}</div>
      <Footer />
    </main>
  );
}
