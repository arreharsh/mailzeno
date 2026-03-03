"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Mail,
  CalendarDays,
  Crown,
  Gauge,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

interface UsageData {
  today: number
  month: number
  plan: string
  limit: number | null
}

export function UsageOverview() {
  const [data, setData] = useState<UsageData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/usage")
      if (!res.ok) return
      const json = await res.json()
      setData(json)
    }
    fetchData()
  }, [])

  /* ── Loading Skeleton ── */
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const percent =
    data.limit && data.limit > 0
      ? Math.min((data.month / data.limit) * 100, 100)
      : 0

  const nearLimit = percent >= 80
  const overLimit = percent >= 100

  const stats = [
    {
      label: "Today",
      value: data.today.toLocaleString(),
      icon: Mail,
      iconBg: "bg-blue-500/10 dark:bg-blue-400/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "This Month",
      value: data.month.toLocaleString(),
      icon: CalendarDays,
      iconBg: "bg-emerald-500/10 dark:bg-emerald-400/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Plan",
      value: data.plan,
      capitalize: true,
      icon: Crown,
      iconBg: "bg-amber-500/10 dark:bg-amber-400/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Monthly Limit",
      value: data.limit === null ? "Unlimited" : data.limit.toLocaleString(),
      icon: Gauge,
      iconBg: "bg-purple-500/10 dark:bg-purple-400/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="rounded-2xl border border-border/60 hover:border-border transition-colors group"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl ${s.iconBg} transition-transform group-hover:scale-105`}
                >
                  <s.icon className={`w-[18px] h-[18px] ${s.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    {s.label}
                  </p>
                  <p
                    className={`text-xl font-bold tracking-tight truncate ${s.capitalize ? "capitalize" : ""
                      }`}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      {data.limit !== null && (
        <Card className="rounded-2xl border border-border/60 overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold">Monthly Usage</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-semibold tabular-nums">
                  {data.month.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-sm"> / </span>
                <span className="text-sm text-muted-foreground font-mono tabular-nums">
                  {data.limit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 w-full rounded-full bg-muted/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${overLimit
                      ? "bg-red-500"
                      : nearLimit
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Percentage label */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {percent.toFixed(1)}% used
                </span>
                <span className="text-xs text-muted-foreground">
                  {data.limit
                    ? (data.limit - data.month).toLocaleString()
                    : 0}{" "}
                  remaining
                </span>
              </div>
            </div>

            {/* Warning Banner */}
            {nearLimit && (
              <div
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${overLimit
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {overLimit
                    ? "You've reached your monthly limit. Upgrade your plan to continue sending."
                    : "You're nearing your monthly limit. Consider upgrading soon."}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
