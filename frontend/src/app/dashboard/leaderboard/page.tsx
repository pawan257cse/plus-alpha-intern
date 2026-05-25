"use client";

import { useEffect, useState } from "react";
import { Trophy, Flame, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Leader {
  _id: string;
  name: string;
  xp: number;
  streak: number;
  coins?: number;
  dailyXp?: number;
  dailyCoins?: number;
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"daily" | "all">("daily");
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    api
      .get("/internships/leaderboard", { params: { period } })
      .then(({ data }) => {
        if (data.success && data.data?.length) setLeaders(data.data);
        else setLeaders([]);
      })
      .catch(() => setLeaders([]));
  }, [period]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Trophy className="h-7 w-7 text-amber-400" />
        Leaderboard
      </h1>
      <p className="text-sm text-muted-foreground">
        See who earned the most coins and XP {period === "daily" ? "today" : "overall"}.
      </p>

      <div className="flex gap-2">
        <Button
          variant={period === "daily" ? "default" : "outline"}
          size="sm"
          onClick={() => setPeriod("daily")}
        >
          Today&apos;s coins
        </Button>
        <Button
          variant={period === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setPeriod("all")}
        >
          All-time XP
        </Button>
      </div>

      <div className="space-y-3">
        {leaders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rankings yet. Log in daily to earn coins!</p>
        ) : (
          leaders.map((l, i) => (
            <Card key={l._id} className={i < 3 ? "border-amber-500/20" : ""}>
              <CardContent className="flex items-center gap-4 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 font-bold text-violet-400">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{l.name}</p>
                  <p className="flex items-center gap-1 text-sm text-amber-400">
                    <Flame className="h-3 w-3 shrink-0" /> {l.streak} day streak
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {period === "daily" ? (
                    <>
                      <p className="flex items-center justify-end gap-1 text-lg font-bold text-amber-400">
                        <Coins className="h-4 w-4" />
                        {l.dailyCoins ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground">{l.dailyXp ?? 0} XP today</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-violet-400">{l.xp} XP</p>
                      <p className="text-xs text-muted-foreground">{l.coins ?? 0} coins total</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
