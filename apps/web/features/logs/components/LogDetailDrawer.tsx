"use client";

import { X, Eye, Mail, Clock, AlertCircle, FileText } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import PreviewModal from "@/features/send-email/components/PreviewModal";

export function LogDetailDrawer({
  log,
  onClose,
}: {
  log: any;
  onClose: () => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!log) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 !m-0 flex">
        {/* Backdrop */}
        <div className="absolute h-full inset-0" onClick={onClose} />

        {/* Panel */}
        <div className="absolute right-0 top-0 h-full w-full md:w-[500px] bg-background shadow-2xl flex flex-col rounded-l-2xl border-l border-border/60">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted/60">
                <FileText className="w-[18px] h-[18px] text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold">Email Details</h2>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-muted transition cursor-pointer"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5 text-sm">
            <DetailRow
              icon={Mail}
              label="Recipient"
              value={log.to_email}
            />
            <DetailRow label="Subject" value={log.subject} />
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1.5">
                Status
              </p>
              <StatusBadge status={log.status} />
            </div>
            <DetailRow
              icon={Clock}
              label="Sent At"
              value={new Date(log.created_at).toLocaleString()}
            />

            {log.error && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1.5">
                  Error
                </p>
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="break-all">{log.error}</span>
                </div>
              </div>
            )}

            {log.html && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  Preview
                </p>
                <div className="relative group border border-border/60 rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-56 bg-white pointer-events-none"
                    sandbox="allow-same-origin"
                    srcDoc={log.html}
                  />
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition duration-300">
                    <button
                      onClick={() => setPreviewOpen(true)}
                      className="flex items-center cursor-pointer gap-2 bg-primary border border-btn-border text-secondary-foreground px-4 py-2.5 rounded-lg shadow-md hover:scale-105 transition text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      View Full Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        form={{
          subject: log.subject,
          body: log.html,
        }}
      />
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
      <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        )}
        <p className="font-medium break-all">{value ?? "—"}</p>
      </div>
    </div>
  );
}
