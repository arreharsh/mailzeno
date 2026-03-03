"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/back-button";

import { Template } from "@/types/template";
import {
  fetchTemplates,
  deleteTemplate,
  duplicateTemplate,
} from "@/lib/templates/templates";

import { TemplatesPageSkeleton } from "@/features/templates/TemplatesPageSkeleton";
import { StarterSection } from "@/features/templates/components/StarterSection";
import { UserSection } from "@/features/templates/components/UserSection";
import { TemplatesHeader } from "@/features/templates/components/TemplatesHeader";
import { TemplatesSearch } from "@/features/templates/components/TemplatesSearch";
import PreviewModal from "@/features/send-email/components/PreviewModal";

export default function TemplatesPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [search, setSearch] = useState("");
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTemplates();
        setUserTemplates(data.data || []);
      } catch (error) {
        toast({
          title: "Failed to load templates",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredUser = useMemo(() => {
    return userTemplates.filter((t) =>
      `${t.name} ${t.subject}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, userTemplates]);

  async function handleDelete(id: string) {
    try {
      await deleteTemplate(id);
      setUserTemplates((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Template deleted",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  }

  async function handleDuplicate(id: string) {
    const data = await duplicateTemplate(id);
    router.push(`/templates/${data.id}/edit`);
  }

  if (loading) {
    return <TemplatesPageSkeleton />;
  }

  return (
    <div className="md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <BackButton />

      {/* Header */}
      <TemplatesHeader />

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <TemplatesSearch value={search} onChange={setSearch} />
        <div className="flex items-center gap-1 border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition ${viewMode === "grid"
              ? "bg-primary text-white shadow-sm"
              : "hover:bg-muted"
              }`}
            title="Grid View"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition ${viewMode === "list"
              ? "bg-primary text-white shadow-sm"
              : "hover:bg-muted"
              }`}
            title="List View"
          >
            <ListIcon size={14} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {userTemplates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-card">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              Total: <span className="font-semibold text-foreground">{userTemplates.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-card">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">
              Total Uses:{" "}
              <span className="font-semibold text-foreground">
                {userTemplates.reduce((sum, t) => sum + (t.usage_count || 0), 0)}
              </span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Starter Section */}
      <StarterSection
        search={search}
        onDuplicate={handleDuplicate}
        onPreview={(template) => setPreviewTemplate(template)}
      />

      {/* User Section */}
      <UserSection
        templates={filteredUser}
        loading={false}
        onDelete={handleDelete}
        viewMode={viewMode}
      />

      {/* Preview */}
      <PreviewModal
        open={!!previewTemplate}
        form={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}
