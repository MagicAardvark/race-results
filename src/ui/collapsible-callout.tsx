"use client";

import { ChevronDown } from "lucide-react";

type CollapsibleCalloutProps = {
    /** Summary line shown when collapsed. Click to expand/collapse. */
    title: React.ReactNode;
    /** Content shown when expanded. */
    children: React.ReactNode;
    /** Optional class for the outer details element. */
    className?: string;
    /** Optional class for the summary (title) row. */
    summaryClassName?: string;
};

/**
 * A callout that is collapsed by default with a clickable summary and chevron.
 * Use for optional details (e.g. "Unable to sync with MotorsportReg" with
 * retry form inside). The summary shows the title and a rotating chevron.
 */
export function CollapsibleCallout({
    title,
    children,
    className = "",
    summaryClassName = "",
}: CollapsibleCalloutProps) {
    return (
        <details
            className={`group rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 [&[open]_summary]:border-amber-200 [&[open]_summary]:pb-3 [&[open]_summary]:dark:border-amber-800 ${className}`}
        >
            <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-medium text-amber-800 selection:bg-transparent dark:text-amber-200 [&::-webkit-details-marker]:hidden ${summaryClassName}`}
            >
                <span>{title}</span>
                <ChevronDown
                    className="size-4 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden
                />
            </summary>
            <div className="flex flex-col gap-4 px-4 pt-0 pb-4">{children}</div>
        </details>
    );
}
