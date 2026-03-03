"use client";

import { useState, useRef } from "react";
import { useTheme } from "next-themes";
import AIGenerateModal from "./AIGenerateModal";
import Editor from "@monaco-editor/react";
import RichEditor from "@/components/editor/RichEditor";
import { AlertCircle, Eye, Sparkles, Wand2, FileCode2, FileText, Layout } from "lucide-react";

type Props = {
  body: string;
  setBody: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  error?: string;
  onPreview: () => void;
  htmlMode: boolean;
  onToggleMode: () => void;
  onChooseTemplate: () => void;
};

export default function MessageEditor({
  body,
  setBody,
  subject,
  setSubject,
  error,
  onPreview,
  htmlMode,
  onChooseTemplate,
  onToggleMode,
}: Props) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const formatHtml = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  // Handle AI buttons
  const handleAI = async (
    type: "generate" | "rewrite",
    customPrompt?: string,
  ) => {
    try {
      setAiLoading(true);

      const res = await fetch("/api/ai/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: htmlMode ? "html" : "text",
          type,
          prompt: type === "generate" ? customPrompt : undefined,
          content: type === "rewrite" ? body : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "AI failed");
        return;
      }

      const subject = data?.result?.subject;
      const content = data?.result?.content;

      if (!subject || !content) {
        alert("AI returned empty subject or content");
        return;
      }

      setSubject(subject);
      setBody(content);
      setAiModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("AI error");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* ── Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3.5 border-b bg-muted/20 backdrop-blur-sm">
        <label className="text-sm font-semibold flex items-center gap-2">
          <FileText size={15} className="text-primary" />
          Message <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Choose Template */}
          <ActionButton
            onClick={onChooseTemplate}
            icon={<Layout size={13} />}
            label="Template"
          />

          {/* HTML / Visual Toggle */}
          <ActionButton
            onClick={onToggleMode}
            icon={htmlMode ? <FileText size={13} /> : <FileCode2 size={13} />}
            label={htmlMode ? "Visual" : "HTML"}
            active={htmlMode}
          />

          {/* Format Code (HTML mode only) */}
          {htmlMode && (
            <ActionButton
              onClick={formatHtml}
              icon={<FileCode2 size={13} />}
              label="Format"
            />
          )}

          {/* Preview */}
          <ActionButton
            onClick={onPreview}
            icon={<Eye size={13} />}
            label="Preview"
            disabled={!body || body === "<p></p>"}
          />

          {/* AI Generate (HTML mode) */}
          {htmlMode && (
            <ActionButton
              onClick={() => setAiModalOpen(true)}
              disabled={aiLoading}
              icon={<Sparkles size={13} />}
              label={aiLoading ? "Thinking..." : "Generate"}
              accent
            />
          )}

          {/* AI Enhance */}
          <ActionButton
            onClick={() => handleAI("rewrite")}
            disabled={aiLoading || !body}
            icon={<Wand2 size={13} />}
            label={aiLoading ? "Thinking..." : "Enhance"}
            accent
          />
        </div>
      </div>

      {/* ── Editor Area ── */}
      {htmlMode ? (
        <div className="border-t">
          <Editor
            height="420px"
            defaultLanguage="html"
            theme={theme === "dark" ? "vs-dark" : "vs"}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            value={body}
            onChange={(value) => setBody(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: "on",
              bracketPairColorization: { enabled: true },
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>
      ) : (
        <div
          className={`transition-all ${error
              ? "ring-2 ring-red-500/20 ring-inset"
              : ""
            }`}
        >
          <RichEditor
            value={body}
            onChange={setBody}
            minHeight={350}
            showToolbar={true}
            autoFocus={false}
          />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="px-4 py-2.5 border-t bg-red-500/5">
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <AlertCircle size={13} />
            {error}
          </p>
        </div>
      )}

      {/* ── AI Generate Modal ── */}
      <AIGenerateModal
        open={aiModalOpen}
        loading={aiLoading}
        onClose={() => setAiModalOpen(false)}
        onGenerate={async (prompt) => {
          try {
            setAiLoading(true);

            const res = await fetch("/api/ai/email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mode: "html",
                type: "generate",
                prompt,
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              alert(data.error || "AI failed");
              return;
            }

            const subject = data?.result?.subject;
            const content = data?.result?.content;

            if (!subject || !content) {
              alert("AI returned empty response");
              return;
            }

            setSubject(subject);
            setBody(content);

            setAiModalOpen(false);
          } catch (err) {
            console.error(err);
            alert("AI error");
          } finally {
            setAiLoading(false);
          }
        }}
      />
    </div>
  );
}

/* ═══════════ Action Button ═══════════ */

function ActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg
        transition-all duration-200 border
        disabled:opacity-40 disabled:cursor-not-allowed
        ${active
          ? "bg-primary text-secondry-foreground border-btn-border shadow-sm"
          : accent
            ? "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
            : "border-border/60 hover:bg-muted hover:border-border"
        }
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
