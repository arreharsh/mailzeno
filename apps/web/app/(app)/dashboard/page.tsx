import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Server,
  FileText,
  CheckCircle2,
  Send,
  AlertTriangle,
  ArrowUpRight,
  Inbox,
  Clock,
  Zap,
  Crown,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PLAN_CONFIG } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import AnalyticsChart from "@/features/analytics/components/analyticsChart";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const todayISO = new Date().toISOString().split("T")[0];

  const [
    { data: stats7 },
    { data: stats30 },
    { count: smtpCount },
    { count: templateCount },
    { data: profile },
    { data: logs },
    { count: emailsTodayCount },
  ] = await Promise.all([
    supabase.rpc("get_email_stats", { days: 7 }),
    supabase.rpc("get_email_stats", { days: 30 }),
    supabase.from("smtp_accounts").select("*", { count: "exact", head: true }),
    supabase.from("templates").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase
      .from("emails_log")
      .select("status, created_at, to_email")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("emails_log")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO),
  ]);

  /* Derived Metrics */

  const emailsToday = emailsTodayCount ?? 0;
  const totalCount = logs?.length ?? 0;
  const successCount = logs?.filter((e) => e.status === "sent").length ?? 0;

  const deliveryRate =
    totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  const userPlan = profile?.plan === "pro" ? "pro" : "free";
  const planConfig = PLAN_CONFIG[userPlan];

  const dailyLimit = planConfig.dailyLimit;
  const usagePercent = Math.min((emailsToday / dailyLimit) * 100, 100);

  const noSMTP = !smtpCount;
  const showUpgradeWarning = profile?.plan !== "pro" && usagePercent >= 80;

  /* Stats config */
  const stats = [
    {
      label: "Emails Today",
      value: emailsToday.toLocaleString(),
      icon: Mail,
      iconBg: "bg-blue-500/10 dark:bg-blue-400/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      href: "/dashboard/logs",
    },
    {
      label: "SMTP Accounts",
      value: smtpCount ?? 0,
      icon: Server,
      iconBg: "bg-purple-500/10 dark:bg-purple-400/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      href: "/dashboard/smtp",
    },
    {
      label: "Templates",
      value: templateCount ?? 0,
      icon: FileText,
      iconBg: "bg-amber-500/10 dark:bg-amber-400/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      href: "/dashboard/templates",
    },
    {
      label: "Delivery Rate",
      value: `${deliveryRate}%`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10 dark:bg-emerald-400/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      href: "/dashboard/logs",
    },
  ];

  /* Render */

  return (
    <div className=" sm:px-6 py-6 sm:py-10 max-w-6xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* Alerts  */}
      <div className="space-y-3">
        {noSMTP && (
          <AlertBox
            text="No SMTP configured. Add one to start sending emails."
            link="/dashboard/smtp/new"
            linkText="Add SMTP"
          />
        )}

        {showUpgradeWarning && <UpgradeBox usagePercent={usagePercent} />}
      </div>

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Monitor your email infrastructure at a glance.
            </p>
          </div>

          <UsageBar
            plan={userPlan}
            usage={emailsToday}
            limit={dailyLimit}
            percent={usagePercent}
          />
        </div>

        <Button
          asChild
          size="lg"
          variant={"main"}
          disabled={noSMTP}
          className="w-full sm:w-auto gap-2"
        >
          <Link href="/dashboard/send">
            <Send className="h-4 w-4" />
            Send Email
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="rounded-2xl border border-border/60 hover:border-border transition-all group h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl ${s.iconBg} transition-transform group-hover:scale-105`}
                  >
                    <s.icon className={`w-[18px] h-[18px] ${s.iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Analytics Chart */}
      <AnalyticsChart stats7={stats7 ?? []} stats30={stats30 ?? []} />

      {/* Recent Activity */}
      <Card className="rounded-2xl border border-border/60 overflow-hidden">
        <CardContent className="p-0">
          {/* Section Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/60">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <h2 className="font-semibold text-sm sm:text-base">
                Recent Activity
              </h2>
            </div>
            <Link href="/dashboard/logs">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Activity Rows */}
          {logs && logs.length > 0 ? (
            <div className="divide-y">
              {logs.slice(0, 5).map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 sm:px-6 py-3.5 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {log.to_email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      ·{" "}
                      {new Date(log.created_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full capitalize ${log.status === "sent"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                  >
                    {log.status === "sent" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-muted/60 mb-3">
                <Inbox className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No emails sent yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Activity will show up here once you start sending.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* Sub-components */

function AlertBox({
  text,
  link,
  linkText,
}: {
  text: string;
  link: string;
  linkText: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-3.5 rounded-xl">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 shrink-0">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{text}</span>
      </div>
      <Link
        href={link}
        className="sm:ml-auto text-sm font-semibold underline underline-offset-2 hover:no-underline whitespace-nowrap"
      >
        {linkText} →
      </Link>
    </div>
  );
}

function UpgradeBox({ usagePercent }: { usagePercent: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
          <Crown className="w-[18px] h-[18px] text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">
            You&apos;re at {Math.round(usagePercent)}% of your daily limit
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upgrade to Pro for 2,000 emails/day and priority support.
          </p>
        </div>
      </div>
      <Button asChild size="sm" className="shrink-0 gap-1.5">
        <Link href="/billing">
          <Zap className="w-3.5 h-3.5" />
          Upgrade
        </Link>
      </Button>
    </div>
  );
}

function UsageBar({
  plan,
  usage,
  limit,
  percent,
}: {
  plan: string;
  usage: number;
  limit: number;
  percent: number;
}) {
  const nearLimit = percent >= 80;
  const overLimit = percent >= 100;

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs bg-muted/80 border border-border/50 px-3 py-1 rounded-full capitalize font-medium">
          {plan ?? "free"} plan
        </span>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {usage.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      <div className="h-2.5 bg-muted/80 rounded-full overflow-hidden">
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
    </div>
  );
}
