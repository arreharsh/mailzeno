"use client";

import { Link2, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/*  Link Dialog */

interface LinkDialogProps {
    open: boolean;
    linkUrl: string;
    onUrlChange: (url: string) => void;
    onApply: () => void;
    onClose: () => void;
}

export function LinkDialog({ open, linkUrl, onUrlChange, onApply, onClose }: LinkDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-card rounded-xl p-6 w-full max-w-md border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                    <Link2 size={18} className="text-primary" />
                    Insert Link
                </h3>
                <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background transition"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onApply();
                        if (e.key === "Escape") onClose();
                    }}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-muted transition text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onApply}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm"
                    >
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
}

/* Image Dialog*/

interface ImageDialogProps {
    open: boolean;
    imageUrl: string;
    onUrlChange: (url: string) => void;
    onInsert: () => void;
    onClose: () => void;
}

export function ImageDialog({ open, imageUrl, onUrlChange, onInsert, onClose }: ImageDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-card rounded-xl p-6 w-full max-w-md border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" />
                    Insert Image
                </h3>
                <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background transition"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onInsert();
                        if (e.key === "Escape") onClose();
                    }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                    You can also drag &amp; drop images directly into the editor.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-muted transition text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onInsert}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm"
                    >
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
}

/* Mode Warning Dialog */

interface ModeWarningProps {
    open: boolean;
    onStay: () => void;
    onSwitch: () => void;
}

export function ModeWarningDialog({ open, onStay, onSwitch }: ModeWarningProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onStay}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[92%] sm:max-w-sm p-0 overflow-hidden rounded-xl bg-card border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
            >
                <div className="px-5 py-4 border-b">
                    <h2 className="text-base font-semibold">Switch to Editor Mode?</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Some advanced HTML formatting may be lost.
                    </p>
                </div>
                <div className="flex gap-3 px-5 py-3 bg-red-500/10">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-500/30">
                        <AlertTriangle className="h-5 w-5 text-secondry-foreground" />
                    </div>
                    <p className="text-sm text-secondry-foreground leading-relaxed">
                        Editor mode does not fully support inline styles, tables or custom
                        classes. Switching may simplify your HTML structure.
                    </p>
                </div>
                <div className="flex border-t gap-3 px-6 py-5">
                    <Button
                        variant="outline"
                        onClick={onStay}
                        className="flex-1 px-4 py-2 border rounded-md transition"
                    >
                        Stay in HTML
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onSwitch}
                        className="flex-1 px-4 py-2 rounded-md transition"
                    >
                        Switch Anyway
                    </Button>
                </div>
            </div>
        </div>
    );
}
