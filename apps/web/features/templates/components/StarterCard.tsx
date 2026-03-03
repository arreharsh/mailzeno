import Link from "next/link";
import { Template } from "@/types/template";
import { Send, Copy, Eye } from "lucide-react";

interface Props {
  template: Template;
  onDuplicate: (id: string) => void;
  onPreview: (template: Template) => void;
}

export function StarterCard({ template, onDuplicate, onPreview }: Props) {
  return (
    <div
      onClick={() => onPreview(template)}
      className="cursor-pointer border rounded-xl p-4 sm:p-5 bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-200 relative flex flex-col group h-full"
    >
      {/* Badge */}
      <span className="absolute top-4 right-4 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Starter
      </span>

      <div>
        <h3 className="font-semibold text-sm pr-16">{template.name}</h3>

        <p className="text-sm font-medium mt-3 truncate text-muted-foreground">
          {template.subject}
        </p>

        <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
          {template.body.replace(/<[^>]+>/g, "")}
        </p>
      </div>

      {/* Preview hint on hover */}
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="inline-flex items-center gap-1 text-[10px] text-primary">
          <Eye size={10} /> Click to preview
        </span>
      </div>

      <div className="flex gap-2 mt-auto pt-4">
        <Link
          href={`/dashboard/send/${template.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-center bg-primary text-secondary-foreground text-sm py-2 border border-btn-border rounded-md hover:bg-primary/90 transition-all hover:shadow-sm inline-flex items-center justify-center gap-1"
        >
          <Send size={12} />
          Use
        </Link>

        <Link
          href={`/dashboard/templates/new?starter=${template.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-center border text-sm py-2 rounded-md hover:bg-muted transition inline-flex items-center justify-center gap-1"
        >
          <Copy size={12} />
          Duplicate
        </Link>
      </div>
    </div>
  );
}
