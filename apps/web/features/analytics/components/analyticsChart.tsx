"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

/* ---------- Normalize DB Aggregated Data ---------- */

function normalizeData(stats: any[] = [], days: number) {
  const today = new Date();
  const safeStats = Array.isArray(stats) ? stats : [];

  const map = new Map(
    safeStats.map((s) => [
      new Date(s.day).toISOString().split("T")[0],
      Number(s.count),
    ]),
  );

  return Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (days - 1 - i));
    const key = d.toISOString().split("T")[0];

    return {
      date: key.slice(5),
      count: map.get(key) ?? 0,
    };
  });
}

export default function AnalyticsChart({
  stats7 = [],
  stats30 = [],
}: {
  stats7?: any[];
  stats30?: any[];
}) {
  const [range, setRange] = useState<7 | 30>(7);
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");

  /* Theme-safe primary color for SVG */
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue("--primary");
    if (primary) {
      setPrimaryColor(`${primary.trim()}`);
    }
  }, []);

  const data = useMemo(() => {
    return range === 7 ? normalizeData(stats7, 7) : normalizeData(stats30, 30);
  }, [range, stats7, stats30]);

  const total = data.reduce((acc, d) => acc + d.count, 0);

  const yesterday = data[data.length - 2]?.count ?? 0;
  const today = data[data.length - 1]?.count ?? 0;

  const trend =
    yesterday > 0 ? Math.round(((today - yesterday) / yesterday) * 100) : 0;

  const TrendIcon = trend >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div>
      <Card className="rounded-2xl border border-border/60 shadow-sm bg-card">
        <CardContent className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-start gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                <Activity className="w-[18px] h-[18px] text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Email Activity ({range} Days)
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {total.toLocaleString()}
                </p>
                <div
                  className={`flex items-center gap-1 text-xs sm:text-sm font-medium mt-0.5 ${trend >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  {trend >= 0 ? "+" : ""}
                  {trend}% from yesterday
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex bg-muted/60 rounded-xl p-1 w-fit border border-border/40">
              <button
                onClick={() => setRange(7)}
                className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${range === 7
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                7D
              </button>
              <button
                onClick={() => setRange(30)}
                className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${range === 30
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                30D
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[220px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={primaryColor}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={primaryColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="currentColor"
                  strokeOpacity={0.06}
                  vertical={false}
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                />

                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    padding: "8px 14px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)",
                  }}
                  cursor={{
                    stroke: "var(--border)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={primaryColor}
                  strokeWidth={2.5}
                  fill="url(#colorEmails)"
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "var(--background)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
