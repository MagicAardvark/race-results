import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EventsSectionProps = {
    id: string;
    title: string;
    variant: "primary" | "muted";
    emptyMessage?: string;
    hasItems: boolean;
    children: React.ReactNode;
};

const sectionWrapperClass = "rounded-2xl border p-6 sm:p-8";

const primarySectionClass = "bg-gradient-to-b from-muted/50 to-muted/20";

const mutedSectionClass = "mt-8 border-muted/50 bg-muted/10";

const primaryHeadingClass =
    "mb-6 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl";

const mutedHeadingClass =
    "mb-6 flex items-center gap-3 text-xl font-bold tracking-tight text-muted-foreground sm:text-2xl";

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
    children,
}: EventsSectionProps) {
    const isPrimary = variant === "primary";
    return (
        <section
            className={cn(
                sectionWrapperClass,
                isPrimary ? primarySectionClass : mutedSectionClass
            )}
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
            {hasItems ? (
                children
            ) : (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                </div>
            )}
        </section>
    );
}
