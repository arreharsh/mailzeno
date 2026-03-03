"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Save,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Type,
  Image as ImageIcon,
  Minus,
  Code2,
  LayoutTemplate,
  Settings2,
  Layers,
  Palette,
  Move,
  SeparatorHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import RichEditor from "@/components/editor/RichEditor";
import { Button } from "@/components/ui/button";
import PreviewTabs from "@/components/dashboard/PreviewTabs";
import { useSearchParams } from "next/navigation";
import { starterTemplates } from "@/lib/templates/starter-templates";
import { BackButton } from "@/components/ui/back-button";

interface TemplateEditorShellProps {
  mode: "create" | "edit";
  templateId?: string;
}

/* ═══════════ Content Block Types ═══════════ */
type BlockType = "text" | "image" | "divider" | "spacer" | "code" | "button";

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  settings: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    backgroundColor: string;
    borderRadius: number;
    alignment: "left" | "center" | "right";
    buttonColor: string;
  };
}

function generateId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createBlock(type: BlockType, content = ""): ContentBlock {
  const defaults: Record<BlockType, string> = {
    text: "<p>Start writing here...</p>",
    image: "",
    divider: "",
    spacer: "",
    code: "<pre><code>// Your code here</code></pre>",
    button: '<a href="#" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Click Here</a>',
  };
  return {
    id: generateId(),
    type,
    content: content || defaults[type],
    settings: {
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: "transparent",
      borderRadius: 0,
      alignment: type === "button" || type === "image" ? "center" : "left",
      buttonColor: "#6366f1",
    },
  };
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode }[] =
  [
    { type: "text", label: "Text Block", icon: <Type size={16} /> },
    { type: "image", label: "Image", icon: <ImageIcon size={16} /> },
    { type: "divider", label: "Divider", icon: <Minus size={16} /> },
    {
      type: "spacer",
      label: "Spacer",
      icon: <SeparatorHorizontal size={16} />,
    },
    { type: "code", label: "Code Block", icon: <Code2 size={16} /> },
    {
      type: "button",
      label: "Button",
      icon: <LayoutTemplate size={16} />,
    },
  ];

const BG_COLORS = [
  "transparent",
  "#ffffff",
  "#f8fafc",
  "#f1f5f9",
  "#e2e8f0",
  "#fef3c7",
  "#dcfce7",
  "#ede9fe",
  "#ffe4e6",
  "#dbeafe",
  "#111827",
  "#1e293b",
];

const BUTTON_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
  "#3b82f6", "#2563eb", "#1d4ed8", "#111827",
];

/* ═══════════════════════════════════════════════ */

export default function TemplateEditorShell({
  mode,
  templateId,
}: TemplateEditorShellProps) {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const starterId = searchParams.get("starter");

  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(
    `<h2>Hello {{name}},</h2><p>Start writing your email...</p>`
  );

  /* ═══ Advanced Mode State ═══ */
  const [advancedMode, setAdvancedMode] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    createBlock("text", `<h2>Hello {{name}},</h2><p>Start writing your email...</p>`),
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ═══ Sync blocks → body ═══ */
  useEffect(() => {
    if (!advancedMode) return;
    const html = blocks
      .map((b) => {
        const s = b.settings;
        const style = `padding:${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px;background:${s.backgroundColor};border-radius:${s.borderRadius}px;text-align:${s.alignment};`;
        if (b.type === "divider")
          return `<div style="${style}"><hr style="border:none;border-top:1px solid #e5e7eb;margin:8px 0;" /></div>`;
        if (b.type === "spacer")
          return `<div style="${style};min-height:32px;"></div>`;
        return `<div style="${style}">${b.content}</div>`;
      })
      .join("");
    setBody(html);
  }, [blocks, advancedMode]);

  /* ═══ Fetch Template (Edit Mode) ═══ */
  useEffect(() => {
    if (mode !== "edit" || !templateId) return;
    const fetchTemplate = async () => {
      try {
        setInitialLoading(true);
        const res = await fetch(`/api/templates/${templateId}`);
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.message || "Failed to load template");
        const template = result.data ?? result;
        setName(template.name || "");
        setSubject(template.subject || "");
        setBody(template.body || "");
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to load template.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTemplate();
  }, [mode, templateId, toast]);

  /* ═══ Starter Prefill ═══ */
  useEffect(() => {
    if (mode !== "create" || !starterId) return;
    const starter = starterTemplates.find((t) => t.id === starterId);
    if (!starter) return;
    setName(starter.name + " (Copy)");
    setSubject(starter.subject);
    setBody(starter.body);
    router.replace("/dashboard/templates/new", { scroll: false });
  }, [mode, starterId, router]);

  /* ═══ Save ═══ */
  const handleSave = async () => {
    if (!name.trim() || !subject.trim() || !body.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields before saving.",
        variant: "destructive",
      });
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(
        mode === "edit" ? `/api/templates/${templateId}` : "/api/templates",
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, subject, body }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to save template");
      toast({
        title: mode === "edit" ? "Template updated" : "Template saved",
        description:
          mode === "edit"
            ? "Your changes have been saved."
            : "Your template has been saved successfully.",
      });
      setTimeout(() => router.push("/dashboard/templates"), 600);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ═══ Variables ═══ */
  const variables = [
    "{{name}}",
    "{{email}}",
    "{{company}}",
    "{{date}}",
    "{{custom}}",
  ];
  const insertVariable = (v: string) => {
    if (advancedMode && activeBlockId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === activeBlockId ? { ...b, content: b.content + " " + v } : b
        )
      );
    } else {
      setBody((prev) => prev + " " + v);
    }
  };

  /* ═══ Block Operations ═══ */
  const addBlock = (type: BlockType, index?: number) => {
    const newBlock = createBlock(type);
    setBlocks((prev) => {
      const arr = [...prev];
      const i = index ?? arr.length;
      arr.splice(i, 0, newBlock);
      return arr;
    });
    setActiveBlockId(newBlock.id);
    setShowBlockPicker(false);
    setInsertIndex(null);
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  const duplicateBlock = (id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const clone = { ...prev[idx], id: generateId() };
      const arr = [...prev];
      arr.splice(idx + 1, 0, clone);
      return arr;
    });
  };

  const updateBlockContent = (id: string, content: string) =>
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b))
    );

  const updateBlockSetting = (
    id: string,
    key: keyof ContentBlock["settings"],
    value: number | string
  ) =>
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, settings: { ...b.settings, [key]: value } } : b
      )
    );

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
  };

  const activeBlock = blocks.find((b) => b.id === activeBlockId);

  /* ═══ Skeleton ═══ */
  if (initialLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  /* ═══════════════════════════════════════════════ */
  /*                      UI                         */
  /* ═══════════════════════════════════════════════ */
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* BACK */}
      <BackButton />

      {/* HEADER — name input + action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template Name"
          className="text-lg sm:text-xl font-semibold bg-transparent border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition w-full sm:max-w-sm"
        />

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Advanced Mode Toggle */}
          <Button
            variant={advancedMode ? "default" : "outline"}
            onClick={() => setAdvancedMode(!advancedMode)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-md transition ${advancedMode
              ? "bg-primary/15 text-primary border-primary/30"
              : ""
              }`}
            type="button"
          >
            <Layers size={14} />
            <span className="hidden sm:inline">
              {advancedMode ? "Simple" : "Advanced"}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs rounded-md border hover:bg-muted transition"
            type="button"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <Button
            variant="main"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-md transition disabled:opacity-50"
          >
            <Save size={15} />
            {saving
              ? mode === "edit"
                ? "Updating..."
                : "Saving..."
              : mode === "edit"
                ? "Update"
                : "Save"}
          </Button>
        </div>
      </div>

      {/* SUBJECT */}
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Email Subject"
        className="w-full border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
      />

      {/* VARIABLES */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          Variables:
        </span>
        {variables.map((v) => (
          <button
            key={v}
            onClick={() => insertVariable(v)}
            className="px-3 py-1 text-xs border rounded-full hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-200"
          >
            {v}
          </button>
        ))}
      </div>

      {/* ═══════════ EDITOR AREA ═══════════ */}
      {advancedMode ? (
        /* ─── Advanced Block Editor ─── */
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Canvas */}
          <div className="flex-1 min-w-0">
            <div className="border rounded-xl overflow-hidden bg-card">
              {/* Canvas Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {blocks.length} Block{blocks.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setInsertIndex(blocks.length);
                    setShowBlockPicker(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition border border-primary/20"
                >
                  <Plus size={13} />
                  Add Block
                </button>
              </div>

              {/* Blocks */}
              <div className="divide-y min-h-[300px]">
                {blocks.map((block, index) => (
                  <div key={block.id}>
                    {/* Insert Point Above */}
                    <div className="relative group/insert">
                      <button
                        onClick={() => {
                          setInsertIndex(index);
                          setShowBlockPicker(true);
                        }}
                        className="absolute inset-x-0 -top-px z-10 h-5 flex items-center justify-center opacity-0 group-hover/insert:opacity-100 transition-opacity"
                      >
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] shadow-lg">
                          <Plus size={10} /> Insert
                        </span>
                      </button>
                    </div>

                    {/* Block */}
                    <motion.div
                      layout
                      className={`relative group transition-all ${activeBlockId === block.id
                        ? "ring-2 ring-primary/30 bg-primary/[0.02]"
                        : "hover:bg-muted/30"
                        }`}
                      onClick={() => setActiveBlockId(block.id)}
                    >
                      {/* Block Controls */}
                      <div className="absolute left-1 top-1 z-10 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1 rounded bg-card shadow border hover:bg-muted transition"
                          title="Drag to reorder"
                        >
                          <GripVertical size={12} className="text-muted-foreground" />
                        </button>
                        {index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(index, index - 1);
                            }}
                            className="p-1 rounded bg-card shadow border hover:bg-muted transition"
                            title="Move Up"
                          >
                            <ChevronUp size={12} />
                          </button>
                        )}
                        {index < blocks.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(index, index + 1);
                            }}
                            className="p-1 rounded bg-card shadow border hover:bg-muted transition"
                            title="Move Down"
                          >
                            <ChevronDown size={12} />
                          </button>
                        )}
                      </div>

                      {/* Block Actions (right) */}
                      <div className="absolute right-1 top-1 z-10 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateBlock(block.id);
                          }}
                          className="p-1 rounded bg-card shadow border hover:bg-muted transition"
                          title="Duplicate"
                        >
                          <Copy size={12} />
                        </button>
                        {blocks.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBlock(block.id);
                            }}
                            className="p-1 rounded bg-card shadow border hover:bg-red-500/10 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      {/* Block Content */}
                      <div
                        style={{
                          padding: `${block.settings.paddingTop}px ${block.settings.paddingRight}px ${block.settings.paddingBottom}px ${block.settings.paddingLeft}px`,
                          textAlign: block.settings.alignment,
                          backgroundColor:
                            block.settings.backgroundColor === "transparent"
                              ? undefined
                              : block.settings.backgroundColor,
                          borderRadius: block.settings.borderRadius,
                        }}
                      >
                        {block.type === "text" && (
                          <RichEditor
                            value={block.content}
                            onChange={(val) =>
                              updateBlockContent(block.id, val)
                            }
                            minHeight={120}
                            showToolbar={activeBlockId === block.id}
                          />
                        )}
                        {block.type === "image" && (
                          <div className="text-center">
                            {block.content ? (
                              <img
                                src={block.content}
                                alt="Block image"
                                className="max-w-full h-auto rounded-lg mx-auto"
                              />
                            ) : (
                              <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3">
                                <ImageIcon
                                  size={32}
                                  className="text-muted-foreground"
                                />
                                <input
                                  type="url"
                                  placeholder="Paste image URL..."
                                  className="w-full max-w-xs border rounded-lg px-3 py-2 text-sm text-center bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  onBlur={(e) =>
                                    updateBlockContent(
                                      block.id,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      updateBlockContent(
                                        block.id,
                                        (e.target as HTMLInputElement).value
                                      );
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {block.type === "divider" && (
                          <hr className="border-t border-border my-2" />
                        )}
                        {block.type === "spacer" && (
                          <div className="h-8 flex items-center justify-center">
                            <span className="text-[10px] text-muted-foreground select-none">
                              ─ spacer ─
                            </span>
                          </div>
                        )}
                        {block.type === "code" && (
                          <RichEditor
                            value={block.content}
                            onChange={(val) =>
                              updateBlockContent(block.id, val)
                            }
                            minHeight={80}
                            showToolbar={activeBlockId === block.id}
                          />
                        )}
                        {block.type === "button" && (
                          <div style={{ textAlign: block.settings.alignment }}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: block.content,
                              }}
                              className="inline-block"
                            />
                            {activeBlockId === block.id && (
                              <div className="mt-3 space-y-2">
                                <input
                                  type="text"
                                  value={
                                    block.content.match(
                                      />(.*?)<\/a>/
                                    )?.[1] || ""
                                  }
                                  onChange={(e) => {
                                    const newContent = block.content.replace(
                                      />(.*?)<\/a>/,
                                      `>${e.target.value}</a>`
                                    );
                                    updateBlockContent(block.id, newContent);
                                  }}
                                  placeholder="Button text"
                                  className="w-full max-w-xs mx-auto block border rounded-lg px-3 py-1.5 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <input
                                  type="url"
                                  value={
                                    block.content.match(
                                      /href="(.*?)"/
                                    )?.[1] || ""
                                  }
                                  onChange={(e) => {
                                    const newContent = block.content.replace(
                                      /href="(.*?)"/,
                                      `href="${e.target.value}"`
                                    );
                                    updateBlockContent(block.id, newContent);
                                  }}
                                  placeholder="Button URL"
                                  className="w-full max-w-xs mx-auto block border rounded-lg px-3 py-1.5 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />

                                {/* Button Color Picker */}
                                <div className="pt-2">
                                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 text-center">Button Color</p>
                                  <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto">
                                    {BUTTON_COLORS.map((c) => (
                                      <button
                                        key={c}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const newContent = block.content.replace(
                                            /background[^;]*;/,
                                            `background:${c};`
                                          );
                                          updateBlockContent(block.id, newContent);
                                          updateBlockSetting(block.id, "buttonColor", c);
                                        }}
                                        className={`w-6 h-6 rounded-md border-2 transition-all ${block.settings.buttonColor === c
                                          ? "border-foreground scale-110 shadow-sm"
                                          : "border-border/40 hover:scale-110"
                                          }`}
                                        style={{ backgroundColor: c }}
                                        title={c}
                                      />
                                    ))}
                                  </div>
                                  {/* Custom Color */}
                                  <div className="flex items-center justify-center gap-2 mt-2">
                                    <input
                                      type="color"
                                      value={block.settings.buttonColor}
                                      onChange={(e) => {
                                        const newContent = block.content.replace(
                                          /background[^;]*;/,
                                          `background:${e.target.value};`
                                        );
                                        updateBlockContent(block.id, newContent);
                                        updateBlockSetting(block.id, "buttonColor", e.target.value);
                                      }}
                                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                                    />
                                    <span className="text-[10px] text-muted-foreground">Custom</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Block Type Badge */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                          {block.type}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ))}

                {blocks.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      No blocks yet. Add your first content block.
                    </p>
                    <button
                      onClick={() => {
                        setInsertIndex(0);
                        setShowBlockPicker(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 transition"
                    >
                      <Plus size={14} /> Add Block
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Settings Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="border rounded-xl bg-card overflow-hidden sticky top-4">
              {/* Sidebar Header */}
              <div className="px-4 py-3 border-b bg-muted/20 flex items-center gap-2">
                <Settings2 size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium">Block Settings</span>
              </div>

              {activeBlock ? (
                <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
                  {/* Block Type */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 block">
                      Type
                    </label>
                    <div className="text-sm font-medium capitalize flex items-center gap-2">
                      {BLOCK_TYPES.find(
                        (bt) => bt.type === activeBlock.type
                      )?.icon}
                      {activeBlock.type}
                    </div>
                  </div>

                  {/* Padding */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2.5 block">
                      Padding (px)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["paddingTop", "Top"],
                          ["paddingRight", "Right"],
                          ["paddingBottom", "Bottom"],
                          ["paddingLeft", "Left"],
                        ] as const
                      ).map(([key, label]) => (
                        <div key={key} className="space-y-1">
                          <span className="text-[10px] text-muted-foreground">
                            {label}
                          </span>
                          <input
                            type="range"
                            min={0}
                            max={64}
                            step={4}
                            value={activeBlock.settings[key]}
                            onChange={(e) =>
                              updateBlockSetting(
                                activeBlock.id,
                                key,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full accent-primary h-1.5"
                          />
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {activeBlock.settings[key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2.5 block">
                      Background
                    </label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {BG_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() =>
                            updateBlockSetting(
                              activeBlock.id,
                              "backgroundColor",
                              c
                            )
                          }
                          className={`w-7 h-7 rounded-md border-2 transition-all ${activeBlock.settings.backgroundColor === c
                            ? "border-primary scale-110 shadow-sm"
                            : "border-border/40 hover:scale-105"
                            }`}
                          style={{
                            backgroundColor: c === "transparent" ? undefined : c,
                            backgroundImage:
                              c === "transparent"
                                ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                                : undefined,
                            backgroundSize:
                              c === "transparent" ? "8px 8px" : undefined,
                            backgroundPosition:
                              c === "transparent" ? "0 0, 4px 4px" : undefined,
                          }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 block">
                      Border Radius
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={24}
                        step={2}
                        value={activeBlock.settings.borderRadius}
                        onChange={(e) =>
                          updateBlockSetting(
                            activeBlock.id,
                            "borderRadius",
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1 accent-primary h-1.5"
                      />
                      <span className="text-xs font-mono text-muted-foreground w-8 text-right">
                        {activeBlock.settings.borderRadius}
                      </span>
                    </div>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2.5 block">
                      Alignment
                    </label>
                    <div className="flex gap-1">
                      {([
                        { value: "left" as const, icon: <AlignLeft size={14} />, label: "Left" },
                        { value: "center" as const, icon: <AlignCenter size={14} />, label: "Center" },
                        { value: "right" as const, icon: <AlignRight size={14} />, label: "Right" },
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            updateBlockSetting(
                              activeBlock.id,
                              "alignment",
                              opt.value
                            )
                          }
                          title={opt.label}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border transition-all text-xs ${activeBlock.settings.alignment === opt.value
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "hover:bg-muted border-border/50"
                            }`}
                        >
                          {opt.icon}
                          <span className="hidden sm:inline">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Move
                    size={24}
                    className="mx-auto text-muted-foreground mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Click a block to edit its settings
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ─── Simple Editor ─── */
        <div className="border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
          <RichEditor
            value={body}
            onChange={setBody}
            minHeight={350}
            autoFocus={mode === "create"}
          />
        </div>
      )}

      {/* ═══ Block Picker Modal ═══ */}
      <AnimatePresence>
        {showBlockPicker && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowBlockPicker(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-card rounded-2xl border shadow-2xl p-5 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Add Content Block</h3>
                <button
                  onClick={() => setShowBlockPicker(false)}
                  className="p-1.5 rounded-md hover:bg-muted transition"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type, insertIndex ?? undefined)}
                    className="flex items-center gap-3 p-3 rounded-xl border hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {bt.icon}
                    </div>
                    <span className="text-xs font-medium">{bt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ PREVIEW MODAL ═══ */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full h-[92dvh] rounded-t-2xl
              sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:max-w-5xl
              border bg-card shadow-2xl overflow-hidden flex flex-col
            "
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/30 shrink-0">
              <div className="sm:hidden absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-muted-foreground/30" />
              <h3 className="text-sm font-semibold tracking-tight">
                Email Preview
              </h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable preview content */}
            <div className="overflow-y-auto flex-1">
              <PreviewTabs form={{ body }} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}