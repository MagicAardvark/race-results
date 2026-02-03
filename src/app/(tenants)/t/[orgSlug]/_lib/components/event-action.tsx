import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

const comingSoonClass =
    "rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 font-medium text-muted-foreground";

type EventExternalLinkProps = {
    href: string;
    label: string;
    variant?: "default" | "outline";
    size?: "sm" | "default";
    className?: string;
};

export function EventExternalLink({
    href,
    label,
    variant = "default",
    size = "sm",
    className,
}: EventExternalLinkProps) {
    return (
        <Button
            size={size}
            variant={variant}
            className={cn("font-medium", className)}
            asChild
        >
            <Link href={href} target="_blank" rel="noopener noreferrer">
                {label}
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </Link>
        </Button>
    );
}

type ComingSoonBadgeProps = {
    label: string;
    size?: "sm" | "xs";
    className?: string;
};

export function ComingSoonBadge({
    label,
    size = "sm",
    className,
}: ComingSoonBadgeProps) {
    return (
        <span
            className={cn(
                comingSoonClass,
                size === "xs" ? "px-3 py-1.5 text-xs" : "px-3 py-1.5 text-sm",
                className
            )}
        >
            {label}
        </span>
    );
}
