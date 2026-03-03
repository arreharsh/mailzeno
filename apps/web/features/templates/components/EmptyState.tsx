import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border rounded-xl p-10 sm:p-14 text-center bg-card relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <FileText size={24} className="text-primary" />
        </div>

        <h3 className="text-lg font-semibold">No templates yet</h3>

        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Create your first reusable email template with our powerful editor.
        </p>

        <Link
          href="/dashboard/templates/new"
          className="inline-flex items-center justify-center gap-2 mt-6 bg-primary text-secondry-foreground border border-btn-border px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all hover:shadow-md w-full sm:w-auto font-medium"
        >
          <Plus size={16} />
          Create Template
        </Link>
      </div>
    </motion.div>
  );
}
