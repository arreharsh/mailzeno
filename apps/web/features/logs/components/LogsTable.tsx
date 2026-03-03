import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Mail, Inbox } from "lucide-react";

export function LogsTable({
  logs,
  onSelect,
}: {
  logs: any[];
  onSelect?: (log: any) => void;
}) {
  if (!logs || logs.length === 0) {
    return (
      <Card className="rounded-2xl border border-border/60 border-dashed">
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/60 mb-4">
            <Inbox className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold">No email logs yet</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Logs will appear here once you start sending emails through the API
            or dashboard.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-border/60 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recipient
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Subject
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, i) => (
            <tr
              key={log.id}
              onClick={() => onSelect?.(log)}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 max-w-[220px]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted/60 shrink-0 group-hover:bg-muted transition-colors">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="truncate font-medium">{log.to_email}</span>
                </div>
              </td>

              <td className="px-6 py-4 max-w-[280px] truncate text-muted-foreground">
                {log.subject || "—"}
              </td>

              <td className="px-6 py-4">
                <StatusBadge status={log.status} />
              </td>

              <td className="px-6 py-4 text-right text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                {new Date(log.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <span className="ml-2 text-muted-foreground/60">
                  {new Date(log.created_at).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
