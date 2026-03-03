"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { RotateKeyDialog } from "./RotateKeyDialog"
import { Shield, Clock, Activity } from "lucide-react"

interface Props {
  data: any
  onRefresh: () => void
}

export function ApiKeyCard({ data, onRefresh }: Props) {
  const maskedKey = `${data.prefix}${"•".repeat(32)}`

  return (
    <Card className="rounded-2xl border border-border/60 overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
          <div className="space-y-4 min-w-0 flex-1">
            {/* Title Row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10">
                <Shield className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold text-base">Active API Key</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Masked Key */}
            <div className="bg-muted/60 border border-border/50 px-4 py-3 rounded-xl font-mono text-xs sm:text-sm break-all select-all tracking-wider text-muted-foreground">
              {maskedKey}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Created{" "}
                  {formatDistanceToNow(new Date(data.created_at))} ago
                </span>
              </div>

              {data.last_used_at && (
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>
                    Last used{" "}
                    {formatDistanceToNow(new Date(data.last_used_at))} ago
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <RotateKeyDialog onRefresh={onRefresh} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}