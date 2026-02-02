import Link from "next/link";
import { RadioIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const LIVE_TIMING_LABEL = "Live Timing";

type LiveTimingLinkProps = {
    href: string;
    className?: string;
    children?: React.ReactNode;
};

/**
 * Link to a live timing page. Renders icon + label by default; pass children to override.
 */
export function LiveTimingLink({
    href,
    className,
    children,
}: LiveTimingLinkProps) {
    return (
        <Link href={href} className={cn("flex items-center gap-2", className)}>
            {children ?? (
                <>
                    <RadioIcon className="h-4 w-4 shrink-0" aria-hidden />
                    {LIVE_TIMING_LABEL}
                </>
            )}
        </Link>
    );
}
