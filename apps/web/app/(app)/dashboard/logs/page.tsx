import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLogs } from "@/features/logs/lib/get-logs";
import { LogsHeader } from "@/features/logs/components/LogsHeader";
import { LogsView } from "@/features/logs/components/LogsView";
import { Pagination } from "@/features/logs/components/Pagination";
import { BackButton } from "@/components/ui/back-button";

export default async function LogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; status?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const status = params?.status ?? "all";

  const { logs, total, pageSize } = await getLogs(user.id, page, status);

  return (
    <div className="sm:px-6 py-6 sm:py-10 max-w-6xl mx-auto w-full space-y-6 sm:space-y-8">
      <BackButton className="pb-0" />
      <LogsHeader currentStatus={status} total={total} />
      <LogsView logs={logs} />

      {total > pageSize && (
        <Pagination
          total={total}
          pageSize={pageSize}
          currentPage={page}
        />
      )}
    </div>
  );
}
