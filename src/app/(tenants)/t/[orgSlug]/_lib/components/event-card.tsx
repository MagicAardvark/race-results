import { cn } from "@/lib/utils";

const baseClass =
    "flex flex-col rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4";

const upcomingClass =
    "gap-3 bg-background shadow-sm transition-shadow hover:shadow-md";

const pastClass = "gap-2 border-muted/50 bg-muted/20";

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
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        "text-lg font-semibold sm:text-xl",
                        isPast ? "text-muted-foreground" : "text-foreground"
                    )}
                >
                    {organization ? `${organization}` : name}
                </p>
                {organization && (
                    <p
                        className={cn(
                            "mt-0.5 text-xs font-medium tracking-wide uppercase",
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
                        "mt-0.5 text-sm",
                        isPast
                            ? "text-muted-foreground/90"
                            : "text-muted-foreground"
                    )}
                >
                    {dateLabel}
                </p>
                {venue && (
                    <p
                        className={cn(
                            "mt-0.5 text-xs",
                            isPast
                                ? "text-muted-foreground/80"
                                : "text-muted-foreground"
                        )}
                    >
                        {venue}
                    </p>
                )}
            </div>
            {(!isPast || action) && (
                <div className="flex shrink-0 items-center gap-2">{action}</div>
            )}
        </li>
    );
}
