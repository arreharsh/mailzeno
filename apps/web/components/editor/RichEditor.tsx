"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Editor from "@monaco-editor/react";
import DOMPurify from "dompurify";

// Sub-components
import FontSize from "./extensions/FontSize";
import { FormattingToolbar } from "./components/FormattingToolbar";
import { MediaToolbar } from "./components/MediaToolbar";
import { LinkDialog, ImageDialog, ModeWarningDialog } from "./components/EditorModals";

/*  Props  */

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  minHeight?: number;
  readOnly?: boolean;
  showToolbar?: boolean;
  autoFocus?: boolean;
  autoSaveDelay?: number;
}

/*  Main Component  */

export default function RichEditor({
  value,
  onChange,
  minHeight = 350,
  readOnly = false,
  showToolbar = true,
  autoFocus = false,
  autoSaveDelay,
}: RichEditorProps) {
  const { theme } = useTheme();
  const monacoRef = useRef<any>(null);

  // Mode states
  const [htmlMode, setHtmlMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Dialog states
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showModeWarning, setShowModeWarning] = useState(false);

  /*  Sanitizer  */
  const sanitize = (html: string) =>
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  /*  Editor Setup  */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
          draggable: "true",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-700 transition-colors",
        },
      }),
    ],
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const clean = sanitize(editor.getHTML());
      setDirty(true);
      onChange(clean);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none px-4 py-4 focus:outline-none " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-3 [&_img]:cursor-move",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              const coords = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              if (coords) {
                const node = view.state.schema.nodes.image.create({ src: base64 });
                view.dispatch(view.state.tr.insert(coords.pos, node));
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  /*  Auto Focus  */
  useEffect(() => {
    if (autoFocus && editor) editor.commands.focus("end");
  }, [editor, autoFocus]);

  /*  Sync External Value  */
  useEffect(() => {
    if (!editor || htmlMode) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value);
      setDirty(false);
    }
  }, [value, editor, htmlMode]);

  /*  Auto Save  */
  useEffect(() => {
    if (!autoSaveDelay || !dirty) return;
    const timer = setTimeout(() => setDirty(false), autoSaveDelay);
    return () => clearTimeout(timer);
  }, [dirty, autoSaveDelay]);

  /*  Fullscreen body lock  */
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  /*  Mode toggle logic  */
  const hasRiskyStyles = (html: string) =>
    [/style=/i, /class=/i, /<div/i, /<table/i, /<span/i, /<font/i].some((p) =>
      p.test(html)
    );

  const handleToggleMode = () => {
    if (htmlMode && hasRiskyStyles(value)) {
      setShowModeWarning(true);
      return;
    }
    setHtmlMode((p) => !p);
  };

  /*  Link handlers  */
  const applyLink = () => {
    if (!editor || !linkUrl) return;
    try {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      new URL(url);
      editor.chain().focus().setLink({ href: url }).run();
      setLinkOpen(false);
      setLinkUrl("");
    } catch { /* invalid URL */ }
  };

  /*  Image handler  */
  const insertImage = () => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setShowImageDialog(false);
    setImageUrl("");
  };

  /*  Loading state  */
  if (!editor) {
    return (
      <div className="p-4 text-muted-foreground text-sm animate-pulse">
        Loading editor...
      </div>
    );
  }

  /*  Render  */

  const wrapperClass = isFullscreen
    ? "fixed inset-0 z-[100] bg-background flex flex-col"
    : "w-full relative";

  return (
    <div className={wrapperClass}>
      {/* Dirty indicator */}
      {dirty && !isFullscreen && (
        <div className="absolute right-3 top-2  text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          Editing...
        </div>
      )}

      {/* Toolbar */}
      {!readOnly && showToolbar && (
        <div className="relative z-11 border-b bg-muted/20 backdrop-blur-sm shrink-0">
          {/* Row 1: Formatting */}
          {!htmlMode && <FormattingToolbar editor={editor} />}

          {/* Row 2: Media & Extras */}
          <MediaToolbar
            editor={editor}
            htmlMode={htmlMode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onToggleMode={handleToggleMode}
            onOpenLink={() => setLinkOpen(true)}
            onOpenImage={() => setShowImageDialog(true)}
            onFormatCode={() => {
              monacoRef.current?.getAction("editor.action.formatDocument")?.run();
            }}
          />
        </div>
      )}

      {/* Editor Area  */}
      {htmlMode ? (
        <div className={isFullscreen ? "flex-1" : ""}>
          <Editor
            height={isFullscreen ? "100%" : `${minHeight + 150}px`}
            defaultLanguage="html"
            theme={theme === "dark" ? "vs-dark" : "vs"}
            value={value}
            onChange={(v) => onChange(v || "")}
            onMount={(editor) => { monacoRef.current = editor; }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              bracketPairColorization: { enabled: true },
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>
      ) : (
        <div
          className={`overflow-y-auto ${isFullscreen ? "flex-1" : ""}`}
          style={{ minHeight: isFullscreen ? undefined : minHeight }}
        >
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Modals */}
      <LinkDialog
        open={linkOpen}
        linkUrl={linkUrl}
        onUrlChange={setLinkUrl}
        onApply={applyLink}
        onClose={() => setLinkOpen(false)}
      />
      <ImageDialog
        open={showImageDialog}
        imageUrl={imageUrl}
        onUrlChange={setImageUrl}
        onInsert={insertImage}
        onClose={() => setShowImageDialog(false)}
      />
      <ModeWarningDialog
        open={showModeWarning}
        onStay={() => setShowModeWarning(false)}
        onSwitch={() => {
          setHtmlMode(false);
          setShowModeWarning(false);
        }}
      />
    </div>
  );
}
