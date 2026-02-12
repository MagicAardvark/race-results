import type { EventDTO } from "@/dto/events";
import type { Event as MotorsportRegEvent } from "@/dto/motorsportreg";
import type { Organization } from "@/dto/organizations";
import { getDateString } from "@/app/(tenants)/t/[orgSlug]/_lib/utils/date-utils";
import {
    mergeOrgAndMrEvents,
    type MergedEventItem,
} from "@/app/(tenants)/t/[orgSlug]/_lib/events/merge-events";

export type AllClubsEventItem = MergedEventItem & {
    orgName: string;
    orgSlug: string;
};

function getSortKey(item: MergedEventItem): string {
    if (item.source === "org") {
        return getDateString(item.orgEvent.startDate);
    }
    return item.event.start;
}

export function mergeAllClubsEvents(
    orgsWithOrgEvents: { org: Organization; orgEvents: EventDTO[] }[],
    orgsWithMrEvents: {
        org: Organization;
        events: MotorsportRegEvent[];
    }[],
    today: string
): { upcoming: AllClubsEventItem[]; past: AllClubsEventItem[] } {
    const upcoming: AllClubsEventItem[] = [];
    const past: AllClubsEventItem[] = [];

    for (const { org, orgEvents } of orgsWithOrgEvents) {
        const mrEvents =
            orgsWithMrEvents.find((o) => o.org.orgId === org.orgId)?.events ??
            [];
        const { upcoming: orgUpcoming, past: orgPast } = mergeOrgAndMrEvents(
            orgEvents,
            mrEvents,
            today
        );
        for (const item of orgUpcoming) {
            upcoming.push({ ...item, orgName: org.name, orgSlug: org.slug });
        }
        for (const item of orgPast) {
            past.push({ ...item, orgName: org.name, orgSlug: org.slug });
        }
    }

    upcoming.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));
    past.sort((a, b) => getSortKey(b).localeCompare(getSortKey(a)));

    return { upcoming, past };
}
