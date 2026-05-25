"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, IndianRupee, Clock, Wifi, Search, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Internship {
  _id: string;
  title: string;
  company: string;
  domain: string;
  location: string;
  stipend: number;
  duration: string;
  isRemote: boolean;
}

const DEMO_INTERNSHIPS: Internship[] = [
  { _id: "1", title: "Frontend Developer Intern", company: "Razorpay", domain: "Web Development", location: "Bangalore", stipend: 25000, duration: "6 months", isRemote: false },
  { _id: "2", title: "ML Engineering Intern", company: "Flipkart", domain: "Machine Learning", location: "Remote", stipend: 30000, duration: "3 months", isRemote: true },
  { _id: "3", title: "UI/UX Design Intern", company: "Swiggy", domain: "UI/UX Design", location: "Mumbai", stipend: 20000, duration: "4 months", isRemote: false },
  { _id: "4", title: "Data Analyst Intern", company: "PhonePe", domain: "Data Science", location: "Hyderabad", stipend: 28000, duration: "6 months", isRemote: true },
];

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>(DEMO_INTERNSHIPS);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/internships", {
          params: { search, domain },
        });
        if (data.success && data.data.internships?.length) {
          setInternships(data.data.internships);
        }
      } catch {
        /* use demo data */
      }
    };
    fetch();
  }, [search, domain]);

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-20">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Find Internships</h1>
        <p className="mb-8 text-muted-foreground">Discover opportunities from top companies</p>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search internships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option value="">All Domains</option>
            <option>Web Development</option>
            <option>Machine Learning</option>
            <option>Data Science</option>
            <option>UI/UX Design</option>
          </select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {internships.map((job, i) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/internships/${job._id}`}>
                <Card className="h-full cursor-pointer hover:-translate-y-1 hover:border-violet-500/30">
                  <CardContent className="pt-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-violet-400">{job.company}</p>
                      </div>
                      <span className="rounded-lg bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
                        {job.domain}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" /> ₹{job.stipend.toLocaleString()}/mo
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {job.duration}
                      </p>
                      {job.isRemote && (
                        <p className="flex items-center gap-2 text-emerald-400">
                          <Wifi className="h-4 w-4" /> Remote
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
