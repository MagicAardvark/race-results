import { formatDateRange } from "../utils/date-utils";
import { formatVenue } from "../events/merge-events";
import type { MergedEventItem } from "../events/merge-events";
import { EventCard } from "./event-card";
import { EventExternalLink, ComingSoonBadge } from "./event-action";

/** MergedEventItem with optional org context (e.g. for all-clubs Events page) */
export type EventListItem = MergedEventItem & {
    orgName?: string;
    orgSlug?: string;
};

type EventListProps = {
    items: EventListItem[];
    variant: "upcoming" | "past";
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

function getDateLabel(item: MergedEventItem): string {
    if (item.source === "org") {
        return formatDateRange(item.orgEvent.startDate, item.orgEvent.endDate);
    }
    return formatDateRange(item.event.start, item.event.end);
}

function getVenue(item: MergedEventItem): string | undefined {
    if (item.source === "mr" && item.event.venue) {
        return formatVenue(item.event.venue);
    }
    return undefined;
}

function getItemKey(item: EventListItem): string {
    if (item.source === "org") return item.orgEvent.eventId;
    return item.orgSlug ? `${item.event.id}-${item.orgSlug}` : item.event.id;
}

export function EventList({ items, variant }: EventListProps) {
    const config = VARIANT_CONFIG[variant];

    return (
        <ul className={config.listClassName} role="list">
            {items.map((item) => {
                const name =
                    item.source === "org"
                        ? item.orgEvent.name
                        : item.event.name;
                const dateLabel = getDateLabel(item);
                const venue = getVenue(item);

                const action =
                    item.source === "org" ? (
                        item.mrEvent ? (
                            <EventExternalLink
                                href={item.mrEvent.detailuri}
                                label={config.linkLabel}
                                variant={config.buttonVariant}
                                className={config.buttonClassName}
                            />
                        ) : (
                            <ComingSoonBadge
                                label={config.comingSoonLabel}
                                size={config.badgeSize}
                            />
                        )
                    ) : (
                        <EventExternalLink
                            href={item.event.detailuri}
                            label={config.linkLabel}
                            variant={config.buttonVariant}
                            className={config.buttonClassName}
                        />
                    );

                return (
                    <EventCard
                        key={getItemKey(item)}
                        name={name}
                        dateLabel={dateLabel}
                        venue={venue}
                        organization={item.orgName}
                        action={action}
                        variant={variant}
                    />
                );
            })}
        </ul>
    );
}
