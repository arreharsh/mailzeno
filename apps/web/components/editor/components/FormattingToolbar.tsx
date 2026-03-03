"use client";

import { useRef, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
    Undo, Redo, Heading1, Heading2, Heading3,
    Bold, Italic, UnderlineIcon, Strikethrough,
    Code as CodeInline, Type, ChevronDown,
} from "lucide-react";
import { ToolbarButton, ToolbarDivider } from "./ToolbarButton";
import { FONT_FAMILIES, FONT_SIZES } from "../constants";

interface Props {
    editor: Editor;
}

export function FormattingToolbar({ editor }: Props) {
    const [showFontFamily, setShowFontFamily] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const fontFamilyRef = useRef<HTMLDivElement>(null);
    const fontSizeRef = useRef<HTMLDivElement>(null);

    /* Close dropdowns on outside click */
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (fontFamilyRef.current && !fontFamilyRef.current.contains(e.target as Node))
                setShowFontFamily(false);
            if (fontSizeRef.current && !fontSizeRef.current.contains(e.target as Node))
                setShowFontSize(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const closeAll = () => {
        setShowFontFamily(false);
        setShowFontSize(false);
    };

    return (
        <div className="flex items-center gap-0.5 px-2 py-1.5 flex-wrap border-b border-border/50">
            {/* Undo / Redo */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                icon={<Undo size={14} />}
                disabled={!editor.can().undo()}
                tooltip="Undo"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                icon={<Redo size={14} />}
                disabled={!editor.can().redo()}
                tooltip="Redo"
            />

            <ToolbarDivider />

            {/* Font Family */}
            <div className="relative" ref={fontFamilyRef}>
                <button
                    onClick={() => {
                        setShowFontFamily(!showFontFamily);
                        setShowFontSize(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs hover:bg-muted transition border border-transparent hover:border-border/50"
                >
                    <Type size={13} />
                    <span className="hidden sm:inline max-w-[80px] truncate">Font</span>
                    <ChevronDown size={10} />
                </button>
                {showFontFamily && (
                    <div className="absolute top-full left-0 mt-1 bg-card border rounded-xl shadow-2xl z-50 p-1.5 min-w-[180px] max-h-[240px] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150">
                        {FONT_FAMILIES.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => {
                                    editor.chain().focus().setFontFamily(f.value).run();
                                    setShowFontFamily(false);
                                }}
                                style={{ fontFamily: f.value }}
                                className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition"
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Font Size */}
            <div className="relative" ref={fontSizeRef}>
                <button
                    onClick={() => {
                        setShowFontSize(!showFontSize);
                        setShowFontFamily(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs hover:bg-muted transition border border-transparent hover:border-border/50"
                >
                    <span className="font-mono text-[11px]">A</span>
                    <ChevronDown size={10} />
                </button>
                {showFontSize && (
                    <div className="absolute top-full left-0 mt-1 bg-card border rounded-xl shadow-2xl z-50 p-1.5 min-w-[100px] max-h-[240px] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150">
                        {FONT_SIZES.map((s) => (
                            <button
                                key={s}
                                onClick={() => {
                                    (editor.commands as any).setFontSize(s);
                                    setShowFontSize(false);
                                }}
                                className="block w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-muted transition"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                icon={<Heading1 size={14} />}
                active={editor.isActive("heading", { level: 1 })}
                tooltip="Heading 1"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                icon={<Heading2 size={14} />}
                active={editor.isActive("heading", { level: 2 })}
                tooltip="Heading 2"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                icon={<Heading3 size={14} />}
                active={editor.isActive("heading", { level: 3 })}
                tooltip="Heading 3"
            />

            <ToolbarDivider />

            {/* Text Styles */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                icon={<Bold size={14} />}
                active={editor.isActive("bold")}
                tooltip="Bold"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                icon={<Italic size={14} />}
                active={editor.isActive("italic")}
                tooltip="Italic"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                icon={<UnderlineIcon size={14} />}
                active={editor.isActive("underline")}
                tooltip="Underline"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                icon={<Strikethrough size={14} />}
                active={editor.isActive("strike")}
                tooltip="Strikethrough"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                icon={<CodeInline size={14} />}
                active={editor.isActive("code")}
                tooltip="Inline Code"
            />
        </div>
    );
}
