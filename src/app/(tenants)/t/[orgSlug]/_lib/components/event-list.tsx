import { formatDateRange } from "@/lib/date-utils";
import { EventCard } from "./event-card";
import { EventExternalLink, ComingSoonBadge } from "./event-action";
import { CalendarEvent } from "@/dto/calendar";

type EventListProps = {
    items: CalendarEvent[];
    variant: "upcoming" | "past";
    displayMode: "combined" | "single-org";
};

const VARIANT_CONFIG = {
    upcoming: {
        linkLabel: "View event & sign up",
        comingSoonLabel: "Sign up coming soon",
        buttonVariant: "default" as const,
        buttonClassName: undefined as string | undefined,
        badgeSize: "sm" as const,
        listClassName: "list-none space-y-4 p-0",
    },
    past: {
        linkLabel: "View event",
        comingSoonLabel: "Event details coming soon",
        buttonVariant: "outline" as const,
        buttonClassName: "text-muted-foreground",
        badgeSize: "xs" as const,
        listClassName: "list-none space-y-3 p-0",
    },
} as const;

function getDateLabel(item: CalendarEvent): string {
    return formatDateRange(item.startDate, item.endDate);
}

export function EventList({ items, variant, displayMode }: EventListProps) {
    const config = VARIANT_CONFIG[variant];

    return (
        <ul className={config.listClassName} role="list">
            {items.map((item) => {
                const title =
                    displayMode === "combined" ? item.org.name : item.name;
                const subTitle = displayMode === "combined" ? item.name : null;
                const dateLabel = getDateLabel(item);
                const venue = item.location;

                const action = item.msrEventLink ? (
                    <EventExternalLink
                        href={item.msrEventLink}
                        label={config.linkLabel}
                        variant={config.buttonVariant}
                        className={config.buttonClassName}
                    />
                ) : (
                    <ComingSoonBadge
                        label={config.comingSoonLabel}
                        size={config.badgeSize}
                    />
                );

                return (
                    <EventCard
                        key={item.eventId}
                        title={title}
                        subTitle={subTitle}
                        dateLabel={dateLabel}
                        venue={venue}
                        action={action}
                        variant={variant}
                    />
                );
            })}
        </ul>
    );
}
