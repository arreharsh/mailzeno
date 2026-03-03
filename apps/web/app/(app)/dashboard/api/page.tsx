"use client";

import { useApiKey } from "@/features/api-key/hooks/useApiKey";
import { ApiKeyCard } from "@/features/api-key/components/ApiKeyCard";
import { EmptyState } from "@/features/api-key/components/EmptyState";
import { IntegrationSection } from "@/features/api-key/components/IntegrationSection";
import { BackButton } from "@/components/ui/back-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";


export default function ApiPage() {
  const { apiKey, loading, refresh } = useApiKey();

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto">
        {/* Back button */}
        <BackButton className="pb-4" />

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              API Access
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mt-1">
            Manage your API keys and integrate MailZeno into your application
            using simple HTTP requests or our official SDK.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 sm:space-y-8">
          {loading ? (
            <div className="space-y-6 sm:space-y-8">
              {/* API Key Card Skeleton */}
              <Card className="rounded-2xl border border-border/60">
                <CardContent className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-11 w-full sm:w-80 rounded-lg" />
                  <div className="flex gap-6">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Start Skeleton */}
              <Card className="rounded-2xl border border-border/60">
                <CardContent className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-9 w-20 rounded-lg" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                  <Skeleton className="h-40 w-full rounded-xl" />
                </CardContent>
              </Card>
            </div>
          ) : apiKey ? (
            <>
              <ApiKeyCard data={apiKey} onRefresh={refresh} />
              <IntegrationSection />
            </>
          ) : (
            <EmptyState onRefresh={refresh} />
          )}
        </div>
      </div>
    </div>
  );
}