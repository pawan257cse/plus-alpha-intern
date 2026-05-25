import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { AnimatedBackground } from "@/components/layout/animated-background";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Plus Alpha Intern — Internships & Verified Certificates",
    template: "%s | Plus Alpha Intern",
  },
  description:
    "Free registration. Pay only when you submit your internship task. Project-based learning with verified certificates.",
  keywords: ["internships", "students", "courses", "certification", "plus alpha intern"],
  openGraph: {
    title: "Plus Alpha Intern",
    description: "Launch your career with structured online internships",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Plus Alpha Intern" }],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <AppProviders>
          <AnimatedBackground />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
