"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  ListFilter,
} from "lucide-react";

const STATUSES = [
  { key: "all", label: "All", icon: ListFilter },
  { key: "sent", label: "Sent", icon: CheckCircle2 },
  { key: "failed", label: "Failed", icon: XCircle },
] as const;

export function LogsHeader({
  currentStatus,
  total,
}: {
  currentStatus: string;
  total?: number;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Email Logs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track delivery status, inspect failures, and preview sent emails.
          {total !== undefined && (
            <span className="ml-1 text-foreground/70 font-medium">
              · {total.toLocaleString()} {total === 1 ? "result" : "results"}
            </span>
          )}
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex bg-muted/50 rounded-xl p-1 border border-border/40 w-fit">
        {STATUSES.map(({ key, label, icon: Icon }) => {
          const isActive = currentStatus === key;
          return (
            <Link
              key={key}
              href={`/dashboard/logs?status=${key}`}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${isActive
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
