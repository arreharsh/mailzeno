"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CreateKeyDialog } from "./CreateKeyDialog"
import { KeyRound } from "lucide-react"

export function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card className="rounded-2xl border border-border/60 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/60 mb-5">
          <KeyRound className="w-6 h-6 text-muted-foreground" />
        </div>

        <h2 className="text-lg font-semibold">No API Key Yet</h2>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
          Generate an API key to start sending emails programmatically through
          MailZeno's REST API or SDK.
        </p>

        <div className="mt-6">
          <CreateKeyDialog onRefresh={onRefresh} />
        </div>
      </CardContent>
    </Card>
  )
}
