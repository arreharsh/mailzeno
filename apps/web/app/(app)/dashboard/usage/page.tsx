import { UsageOverview } from "@/features/usage/components/UsageOverview"
import { BackButton } from "@/components/ui/back-button"
import { UsageChart } from "@/features/usage/components/UsageChart"

export default function UsagePage() {
  return (
    <div className="flex justify-center w-full px-4 sm:px-6">
      <div className="w-full max-w-5xl space-y-8 py-8 sm:py-10">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <BackButton className="pb-2" />
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Usage
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-lg">
            Monitor your email sending activity, track plan limits, and
            visualize trends over time.
          </p>
        </div>

        {/* Overview Cards & Progress */}
        <UsageOverview />

        {/* Activity Chart */}
        <UsageChart />
      </div>
    </div>
  )
}
