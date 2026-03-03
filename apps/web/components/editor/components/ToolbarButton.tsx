import React from "react";

/* Toolbar Button  */

interface TBProps {
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    tooltip?: string;
    small?: boolean;
}

export function ToolbarButton({
    icon,
    children,
    onClick,
    active = false,
    disabled = false,
    tooltip,
    small = false,
}: TBProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={tooltip}
            className={`${small ? "p-1" : "p-1.5"
                } rounded-md flex items-center gap-1.5 transition-all duration-150 ${active
                    ? "bg-primary text-secondry-foreground border border-btn-border shadow-sm"
                    : disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-muted border border-transparent hover:border-border/50"
                }`}
        >
            {icon}
            {children && <span className="text-xs">{children}</span>}
        </button>
    );
}

/*  Toolbar Divider  */

export function ToolbarDivider() {
    return <div className="w-px h-5 bg-border/60 mx-0.5" />;
}
