import { CheckCircle2, XCircle, Clock } from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; icon: typeof CheckCircle2 }
> = {
  sent: {
    bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  failed: {
    bg: "bg-red-500/10 dark:bg-red-400/10",
    text: "text-red-600 dark:text-red-400",
    icon: XCircle,
  },
};

const DEFAULT_CONFIG = {
  bg: "bg-muted",
  text: "text-muted-foreground",
  icon: Clock,
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full capitalize ${config.bg} ${config.text}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}
