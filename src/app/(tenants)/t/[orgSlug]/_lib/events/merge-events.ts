import type { EventDTO } from "@/dto/events";
import type { Event as MotorsportRegEvent, Venue } from "@/dto/motorsportreg";
import { getDateString } from "../utils/date-utils";

export type MergedEventItem =
    | {
          source: "org";
          orgEvent: EventDTO;
          mrEvent?: MotorsportRegEvent;
      }
    | { source: "mr"; event: MotorsportRegEvent };

export function formatVenue(venue: Venue): string {
    return [venue.city, venue.region].filter(Boolean).join(", ");
}

export function mergeOrgAndMrEvents(
    orgEvents: EventDTO[],
    mrEvents: MotorsportRegEvent[],
    today: string
): { upcoming: MergedEventItem[]; past: MergedEventItem[] } {
    const upcomingOrg = orgEvents.filter(
        (e) => getDateString(e.startDate) >= today
    );
    const pastOrg = orgEvents
        .filter((e) => getDateString(e.endDate) < today)
        .reverse();
    const upcomingMr = mrEvents.filter((e) => e.end >= today);
    const pastMr = mrEvents
        .filter((e) => e.end < today)
        .sort((a, b) => b.end.localeCompare(a.end));

    const orgStartDates = new Set(
        orgEvents.map((e) => getDateString(e.startDate))
    );

    function findMrForDate(
        startDate: Date | string
    ): MotorsportRegEvent | undefined {
        return mrEvents.find((e) => e.start === getDateString(startDate));
    }

    const sortByDateAsc = (a: MergedEventItem, b: MergedEventItem) => {
        const dateA =
            a.source === "org"
                ? getDateString(a.orgEvent.startDate)
                : a.event.start;
        const dateB =
            b.source === "org"
                ? getDateString(b.orgEvent.startDate)
                : b.event.start;
        return dateA.localeCompare(dateB);
    };
    const sortByDateDesc = (a: MergedEventItem, b: MergedEventItem) =>
        -sortByDateAsc(a, b);

    const upcoming: MergedEventItem[] = [
        ...upcomingOrg.map((orgEvent) => ({
            source: "org" as const,
            orgEvent,
            mrEvent: findMrForDate(orgEvent.startDate),
        })),
        ...upcomingMr
            .filter((e) => !orgStartDates.has(e.start))
            .map((event) => ({ source: "mr" as const, event })),
    ].sort(sortByDateAsc);

    const past: MergedEventItem[] = [
        ...pastOrg.map((orgEvent) => ({
            source: "org" as const,
            orgEvent,
            mrEvent: findMrForDate(orgEvent.startDate),
        })),
        ...pastMr
            .filter((e) => !orgStartDates.has(e.start))
            .map((event) => ({ source: "mr" as const, event })),
    ].sort(sortByDateDesc);

    return { upcoming, past };
}
