"use client";

import { Template } from "@/types/template";
import { UserTemplateCard } from "./UserTemplateCard";
import { EmptyState } from "./EmptyState";
import { motion } from "framer-motion";

interface Props {
  templates: Template[];
  loading: boolean;
  onDelete: (id: string) => void;
  viewMode?: "grid" | "list";
}

export function UserSection({
  templates,
  loading,
  onDelete,
  viewMode = "grid",
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Your Templates</h2>
        <p className="text-sm text-muted-foreground">
          Templates you have created
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Loading templates...
        </p>
      ) : templates.length === 0 ? (
        <EmptyState />
      ) : viewMode === "list" ? (
        <div className="space-y-3">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <UserTemplateCard
                template={template}
                onDelete={onDelete}
                layout="list"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <UserTemplateCard
                template={template}
                onDelete={onDelete}
                layout="grid"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
