"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  total,
  pageSize,
  currentPage,
}: {
  total: number;
  pageSize: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  /** Build href that preserves all existing query params (e.g. status) */
  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-4 pb-2">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border/60 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border/30 rounded-lg text-muted-foreground/40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </span>
      )}

      <span className="px-3 py-2 text-sm text-muted-foreground tabular-nums">
        <span className="font-medium text-foreground">{currentPage}</span>
        <span className="mx-1">/</span>
        {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border/60 rounded-lg hover:bg-muted transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border/30 rounded-lg text-muted-foreground/40 cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
