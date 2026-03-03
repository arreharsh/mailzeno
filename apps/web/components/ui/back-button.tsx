"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
    /** Override the default `router.back()` behavior */
    href?: string;
    /** Custom label — defaults to "Back" */
    label?: string;
    /** Extra class overrides */
    className?: string;
    /** Enable entrance animation */
    animated?: boolean;
}

export function BackButton({
    href,
    label = "Back",
    className = "",
    animated = true,
}: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    const Comp = animated ? motion.button : "button";

    const animationProps = animated
        ? {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.2 },
        }
        : {};

    return (
        <Comp
            onClick={handleClick}
            className={`flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition group ${className}`}
            {...(animationProps as any)}
        >
            <ArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
            />
            {label}
        </Comp>
    );
}
