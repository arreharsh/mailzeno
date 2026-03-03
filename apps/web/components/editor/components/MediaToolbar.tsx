"use client";

import { useRef, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
    Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Minus, Link2, Unlink, Image as ImageIcon,
    Maximize2, Minimize2, Code, RotateCcw, Indent,
} from "lucide-react";
import { ToolbarButton, ToolbarDivider } from "./ToolbarButton";
import { PRESET_COLORS, HIGHLIGHT_COLORS } from "../constants";

interface Props {
    editor: Editor;
    htmlMode: boolean;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    onToggleMode: () => void;
    onOpenLink: () => void;
    onOpenImage: () => void;
    onFormatCode?: () => void;
}

export function MediaToolbar({
    editor,
    htmlMode,
    isFullscreen,
    onToggleFullscreen,
    onToggleMode,
    onOpenLink,
    onOpenImage,
    onFormatCode,
}: Props) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [customColor, setCustomColor] = useState("#6366f1");
    const colorRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);

    /* Close on outside click */
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (colorRef.current && !colorRef.current.contains(e.target as Node))
                setShowColorPicker(false);
            if (highlightRef.current && !highlightRef.current.contains(e.target as Node))
                setShowHighlightPicker(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const removeLink = () => editor?.chain().focus().unsetLink().run();

    return (
        <div className="flex items-center justify-between px-2 py-1.5 flex-wrap gap-y-1">
            {!htmlMode && (
                <div className="flex items-center gap-0.5 flex-wrap">
                    {/*  Text Color  */}
                    <div className="relative" ref={colorRef}>
                        <button
                            onClick={() => {
                                setShowColorPicker(!showColorPicker);
                                setShowHighlightPicker(false);
                            }}
                            className="flex items-center gap-1 p-1.5 rounded-md hover:bg-muted transition group"
                            title="Text Color"
                        >
                            <Palette size={14} />
                            <span
                                className="w-3 h-3 rounded-sm border"
                                style={{
                                    backgroundColor:
                                        (editor.getAttributes("textStyle")?.color as string) || "currentColor",
                                }}
                            />
                        </button>
                        {showColorPicker && (
                            <div className="absolute top-full left-0 mt-1 bg-card border rounded-xl shadow-2xl z-50 p-3 min-w-[220px] animate-in fade-in-0 zoom-in-95 duration-150">
                                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-2 tracking-wider">
                                    Text Color
                                </p>
                                <div className="grid grid-cols-10 gap-1 mb-3">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                editor.chain().focus().setColor(c).run();
                                                setShowColorPicker(false);
                                            }}
                                            className="w-5 h-5 rounded-sm border border-border/40 hover:scale-125 transition-transform"
                                            style={{ backgroundColor: c }}
                                            title={c}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t">
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={(e) => setCustomColor(e.target.value)}
                                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                                    />
                                    <button
                                        onClick={() => {
                                            editor.chain().focus().setColor(customColor).run();
                                            setShowColorPicker(false);
                                        }}
                                        className="text-xs px-2 py-1 rounded-md hover:bg-muted transition"
                                    >
                                        Apply Custom
                                    </button>
                                    <button
                                        onClick={() => {
                                            editor.chain().focus().unsetColor().run();
                                            setShowColorPicker(false);
                                        }}
                                        className="text-xs px-2 py-1 rounded-md hover:bg-muted transition ml-auto"
                                    >
                                        <RotateCcw size={11} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/*  Highlight  */}
                    <div className="relative" ref={highlightRef}>
                        <button
                            onClick={() => {
                                setShowHighlightPicker(!showHighlightPicker);
                                setShowColorPicker(false);
                            }}
                            className="flex items-center gap-1 p-1.5 rounded-md hover:bg-muted transition"
                            title="Highlight"
                        >
                            <Highlighter size={14} />
                        </button>
                        {showHighlightPicker && (
                            <div className="absolute top-full left-0 mt-1 bg-card border rounded-xl shadow-2xl z-50 p-3 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-150">
                                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-2 tracking-wider">
                                    Highlight
                                </p>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {HIGHLIGHT_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                editor.chain().focus().toggleHighlight({ color: c }).run();
                                                setShowHighlightPicker(false);
                                            }}
                                            className="w-7 h-7 rounded-md border border-border/40 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: c }}
                                            title={c}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        editor.chain().focus().unsetHighlight().run();
                                        setShowHighlightPicker(false);
                                    }}
                                    className="mt-2 text-xs text-muted-foreground hover:text-foreground transition w-full text-center py-1"
                                >
                                    Remove Highlight
                                </button>
                            </div>
                        )}
                    </div>

                    <ToolbarDivider />

                    {/*  Alignment  */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        icon={<AlignLeft size={14} />}
                        active={editor.isActive({ textAlign: "left" })}
                        tooltip="Align Left"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        icon={<AlignCenter size={14} />}
                        active={editor.isActive({ textAlign: "center" })}
                        tooltip="Align Center"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        icon={<AlignRight size={14} />}
                        active={editor.isActive({ textAlign: "right" })}
                        tooltip="Align Right"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        icon={<AlignJustify size={14} />}
                        active={editor.isActive({ textAlign: "justify" })}
                        tooltip="Justify"
                    />

                    <ToolbarDivider />

                    {/*  Lists  */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        icon={<List size={14} />}
                        active={editor.isActive("bulletList")}
                        tooltip="Bullet List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        icon={<ListOrdered size={14} />}
                        active={editor.isActive("orderedList")}
                        tooltip="Ordered List"
                    />

                    <ToolbarDivider />

                    {/*  Horizontal Rule  */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        icon={<Minus size={14} />}
                        tooltip="Horizontal Rule"
                    />

                    {/*  Link  */}
                    <ToolbarButton
                        onClick={onOpenLink}
                        icon={<Link2 size={14} />}
                        active={editor.isActive("link")}
                        tooltip="Insert Link"
                    />
                    {editor.isActive("link") && (
                        <ToolbarButton
                            onClick={removeLink}
                            icon={<Unlink size={14} />}
                            tooltip="Remove Link"
                        />
                    )}

                    {/*  Image  */}
                    <ToolbarButton
                        onClick={onOpenImage}
                        icon={<ImageIcon size={14} />}
                        tooltip="Insert Image"
                    />
                </div>
            )}

            {/*  Right side: Format Code + Fullscreen + Mode Toggle  */}
            <div className="flex items-center gap-1 ml-auto">
                {htmlMode && onFormatCode && (
                    <ToolbarButton
                        onClick={onFormatCode}
                        icon={<Indent size={14} />}
                        tooltip="Format Code"
                    >
                        Format
                    </ToolbarButton>
                )}
                <ToolbarButton
                    onClick={onToggleFullscreen}
                    icon={isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    tooltip={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                />
                <ToolbarButton
                    onClick={onToggleMode}
                    icon={<Code size={14} />}
                    active={htmlMode}
                    tooltip={htmlMode ? "Visual Editor" : "HTML Mode"}
                >
                    {htmlMode ? "Visual" : "HTML"}
                </ToolbarButton>
            </div>
        </div>
    );
}
