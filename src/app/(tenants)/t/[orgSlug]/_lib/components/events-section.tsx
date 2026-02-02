import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EventsSectionProps = {
    id: string;
    title: string;
    variant: "primary" | "muted";
    emptyMessage?: string;
    hasItems: boolean;
};

const mutedSectionClass = "mt-8";

const primaryHeadingClass =
    "flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl";

const mutedHeadingClass =
    "flex items-center gap-3 text-xl font-bold tracking-tight text-muted-foreground sm:text-2xl";

const primaryIconClass =
    "flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary";

const mutedIconClass =
    "flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground";

export function EventsSection({
    id,
    title,
    variant,
    emptyMessage = "No events scheduled. Check back soon.",
    hasItems,
}: EventsSectionProps) {
    const isPrimary = variant === "primary";

    return (
        <section
            className={!isPrimary ? mutedSectionClass : undefined}
            aria-labelledby={`${id}-heading`}
        >
            <h2
                id={`${id}-heading`}
                className={isPrimary ? primaryHeadingClass : mutedHeadingClass}
            >
                <span
                    className={isPrimary ? primaryIconClass : mutedIconClass}
                    aria-hidden
                >
                    <CalendarIcon
                        className={cn(
                            isPrimary
                                ? "h-5 w-5 sm:h-6 sm:w-6"
                                : "h-4 w-4 sm:h-5 sm:w-5"
                        )}
                    />
                </span>
                {title}
            </h2>
            {!hasItems && (
                <div className="mt-4 py-8 text-center">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                </div>
            )}
        </section>
    );
}
