"use client";

import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

export default function AdminAiSettingsPage() {
  const [status, setStatus] = useState<{ configured: boolean; message: string } | null>(null);

  useEffect(() => {
    api.get("/ai/status").then(({ data }) => {
      if (data.success) setStatus(data.data);
    });
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Brain className="h-7 w-7 text-violet-400" />
        AI Management
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Gemini API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            Status:{" "}
            <span className={status?.configured ? "text-emerald-500" : "text-amber-500"}>
              {status?.configured ? "Configured" : "Not configured"}
            </span>
          </p>
          <p className="text-muted-foreground">{status?.message}</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Set <code className="text-violet-400">GEMINI_API_KEY</code> in backend <code>.env</code></li>
            <li>Key must start with <code>AIza</code> from Google AI Studio</li>
            <li>Prompts are defined in <code>backend/src/services/ai/gemini.ts</code></li>
            <li>Usage analytics: track via server logs or add MongoDB AI usage collection later</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
