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
    className?: string;
};

export function ComingSoonBadge({ label, className }: ComingSoonBadgeProps) {
    return (
        <span
            className={cn(
                comingSoonClass,
                "inline-flex h-7 items-center justify-center px-2.5 text-[0.8rem]",
                className
            )}
        >
            {label}
        </span>
    );
}
