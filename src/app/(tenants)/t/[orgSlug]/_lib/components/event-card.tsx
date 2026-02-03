import { CalendarIcon, MapPinIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const baseClass =
    "flex flex-col rounded-xl border sm:flex-row sm:items-center sm:justify-between sm:gap-6";

const upcomingClass =
    "gap-3 border-l-4 border-l-primary bg-background p-5 shadow-sm transition-shadow hover:shadow-md";

const pastClass = "gap-2 border-muted/50 bg-muted/20 p-4";

export type EventCardProps = {
    name: string;
    dateLabel: string;
    venue?: string;
    organization?: string;
    action?: React.ReactNode;
    variant: "upcoming" | "past";
};

export function EventCard({
    name,
    dateLabel,
    venue,
    organization,
    action,
    variant,
}: EventCardProps) {
    const isPast = variant === "past";
    return (
        <li className={cn(baseClass, isPast ? pastClass : upcomingClass)}>
            <div className="min-w-0 flex-1 space-y-1">
                <p
                    className={cn(
                        "text-base leading-tight font-semibold sm:text-lg",
                        isPast ? "text-muted-foreground" : "text-foreground"
                    )}
                >
                    {organization ?? name}
                </p>
                {organization && (
                    <p
                        className={cn(
                            "text-xs font-medium tracking-wide uppercase",
                            isPast
                                ? "text-muted-foreground/80"
                                : "text-muted-foreground"
                        )}
                    >
                        {name}
                    </p>
                )}
                <p
                    className={cn(
                        "flex items-center gap-2 text-sm",
                        isPast
                            ? "text-muted-foreground/90"
                            : "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden />
                    {dateLabel}
                </p>
                {venue && (
                    <p
                        className={cn(
                            "flex items-center gap-2 text-xs",
                            isPast
                                ? "text-muted-foreground/80"
                                : "text-muted-foreground"
                        )}
                    >
                        <MapPinIcon
                            className="h-3.5 w-3.5 shrink-0"
                            aria-hidden
                        />
                        {venue}
                    </p>
                )}
            </div>
            {(!isPast || action) && (
                <div className="flex shrink-0 items-center gap-2 pt-2 sm:pt-0">
                    {action}
                </div>
            )}
        </li>
    );
}
