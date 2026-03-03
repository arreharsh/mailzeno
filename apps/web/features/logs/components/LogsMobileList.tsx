"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Mail, Clock, AlertCircle, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import PreviewModal from "@/features/send-email/components/PreviewModal";

export function LogsMobileList({ logs }: any) {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!logs || logs.length === 0) {
    return (
      <Card className="rounded-2xl border border-border/60 border-dashed">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/60 mb-4">
            <Inbox className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold">No email logs yet</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Logs will appear here once you start sending emails.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Card List */}
      <div className="space-y-3">
        {logs.map((log: any) => (
          <Card
            key={log.id}
            className="rounded-xl border border-border/60 active:scale-[0.99] transition-all cursor-pointer hover:border-border"
            onClick={() => setSelectedLog(log)}
          >
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/60 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="font-medium truncate text-sm">
                    {log.to_email}
                  </span>
                </div>
                <StatusBadge status={log.status} />
              </div>
              <p className="text-sm text-muted-foreground truncate pl-[42px]">
                {log.subject || "No subject"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 pl-[42px]">
                <Clock className="w-3 h-3" />
                {new Date(log.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                ·{" "}
                {new Date(log.created_at).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {selectedLog && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={() => setSelectedLog(null)}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background border-t rounded-t-2xl shadow-2xl"
              style={{ maxHeight: "85vh" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b shrink-0">
                <h2 className="text-base font-semibold">Email Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4 text-sm">
                <DetailRow
                  icon={Mail}
                  label="To"
                  value={selectedLog.to_email}
                />
                <DetailRow label="Subject" value={selectedLog.subject} />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={selectedLog.status} />
                </div>
                <DetailRow
                  icon={Clock}
                  label="Sent At"
                  value={new Date(selectedLog.created_at).toLocaleString()}
                />

                {selectedLog.error && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="break-all">{selectedLog.error}</span>
                  </div>
                )}

                {selectedLog.html && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Preview
                    </p>
                    <div className="relative group border border-border/60 rounded-xl overflow-hidden">
                      <iframe
                        className="w-full h-52 bg-white pointer-events-none"
                        sandbox="allow-same-origin"
                        srcDoc={selectedLog.html}
                      />
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition duration-300">
                        <button
                          onClick={() => setPreviewOpen(true)}
                          className="flex items-center gap-2 bg-primary border border-btn-border text-secondary-foreground px-4 py-2.5 rounded-lg shadow-md hover:scale-105 transition cursor-pointer text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          View Full Preview
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full Preview Modal */}
      {selectedLog && (
        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          form={{
            subject: selectedLog.subject,
            body: selectedLog.html,
          }}
        />
      )}
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: any;
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        <p className="font-medium break-all">{value ?? "—"}</p>
      </div>
    </div>
  );
}