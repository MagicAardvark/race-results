import { describe, it, expect, vi } from "vitest";
import { formatVenue, mergeOrgAndMrEvents } from "./merge-events";
import type { EventDTO } from "@/dto/events";
import type { Event as MotorsportRegEvent, Venue } from "@/dto/motorsportreg";

vi.mock("../utils/date-utils", () => ({
    getDateString: (d: Date | string) => {
        if (typeof d === "string") return d.slice(0, 10);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    },
}));

function orgEvent(
    overrides: Partial<EventDTO> & { startAt: Date; endAt: Date }
): EventDTO {
    return {
        eventId: "evt-1",
        orgId: "org-1",
        name: "Org Event",
        slug: "org-event",
        seasonId: "season-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

function mrEvent(overrides: Partial<MotorsportRegEvent>): MotorsportRegEvent {
    return {
        id: "mr-1",
        name: "MR Event",
        type: "autocross",
        start: "2026-06-10",
        end: "2026-06-10",
        detailuri: "https://example.com/event",
        venue: { id: "v1", city: "Boston", region: "MA" },
        ...overrides,
    };
}

describe("formatVenue", () => {
    it("joins name, city, and region", () => {
        const venue: Venue = {
            id: "v1",
            city: "Ayer",
            region: "MA",
        };
        expect(formatVenue(venue)).toBe("Ayer, MA");
    });

    it("filters out empty parts", () => {
        const venue: Venue = {
            id: "v1",
            city: "",
            region: "MA",
        };
        expect(formatVenue(venue)).toBe("MA");
    });
});

describe("mergeOrgAndMrEvents", () => {
    const today = "2026-06-01";

    it("returns upcoming org events with matching MR event when same date", () => {
        const start = new Date("2026-06-10T00:00:00");
        const end = new Date("2026-06-10T23:59:59");
        const orgEvents = [
            orgEvent({ eventId: "e1", startAt: start, endAt: end }),
        ];
        const mrEvents = [
            mrEvent({ id: "mr1", start: "2026-06-10", end: "2026-06-10" }),
        ];

        const { upcoming, past } = mergeOrgAndMrEvents(
            orgEvents,
            mrEvents,
            today
        );

        expect(upcoming).toHaveLength(1);
        expect(upcoming[0]!.source).toBe("org");
        if (upcoming[0]!.source === "org") {
            expect(upcoming[0].orgEvent.name).toBe("Org Event");
            expect(upcoming[0].mrEvent?.id).toBe("mr1");
        }
        expect(past).toHaveLength(0);
    });

    it("returns org event without MR link when no matching MR date", () => {
        const start = new Date("2026-06-15T00:00:00");
        const end = new Date("2026-06-15T23:59:59");
        const orgEvents = [
            orgEvent({ eventId: "e1", startAt: start, endAt: end }),
        ];
        const mrEvents = [
            mrEvent({ id: "mr1", start: "2026-06-10", end: "2026-06-10" }),
        ];

        const { upcoming } = mergeOrgAndMrEvents(orgEvents, mrEvents, today);

        const orgItem = upcoming.find((i) => i.source === "org");
        expect(orgItem).toBeDefined();
        if (orgItem?.source === "org") {
            expect(orgItem.orgEvent.name).toBe("Org Event");
            expect(orgItem.mrEvent).toBeUndefined();
        }
    });

    it("includes MR-only events when no org event on that date", () => {
        const orgEvents: EventDTO[] = [];
        const mrEvents = [
            mrEvent({ id: "mr1", start: "2026-06-10", end: "2026-06-10" }),
        ];

        const { upcoming } = mergeOrgAndMrEvents(orgEvents, mrEvents, today);

        expect(upcoming).toHaveLength(1);
        expect(upcoming[0]!.source).toBe("mr");
        if (upcoming[0]!.source === "mr") {
            expect(upcoming[0].event.id).toBe("mr1");
        }
    });

    it("excludes MR event when org event exists on same start date", () => {
        const start = new Date("2026-06-10T00:00:00");
        const end = new Date("2026-06-10T23:59:59");
        const orgEvents = [
            orgEvent({ eventId: "e1", startAt: start, endAt: end }),
        ];
        const mrEvents = [
            mrEvent({ id: "mr1", start: "2026-06-10", end: "2026-06-10" }),
        ];

        const { upcoming } = mergeOrgAndMrEvents(orgEvents, mrEvents, today);

        expect(upcoming).toHaveLength(1);
        expect(upcoming[0]!.source).toBe("org");
        expect(upcoming.filter((i) => i.source === "mr")).toHaveLength(0);
    });

    it("splits past and upcoming by end date", () => {
        const pastStart = new Date("2026-05-01T00:00:00");
        const pastEnd = new Date("2026-05-01T23:59:59");
        const futureStart = new Date("2026-07-01T00:00:00");
        const futureEnd = new Date("2026-07-01T23:59:59");
        const orgEvents = [
            orgEvent({ eventId: "e1", startAt: pastStart, endAt: pastEnd }),
            orgEvent({ eventId: "e2", startAt: futureStart, endAt: futureEnd }),
        ];
        const mrEvents: MotorsportRegEvent[] = [];

        const { upcoming, past } = mergeOrgAndMrEvents(
            orgEvents,
            mrEvents,
            today
        );

        expect(upcoming).toHaveLength(1);
        expect(
            upcoming[0]!.source === "org" && upcoming[0].orgEvent.eventId
        ).toBe("e2");
        expect(past).toHaveLength(1);
        expect(past[0]!.source === "org" && past[0].orgEvent.eventId).toBe(
            "e1"
        );
    });
});
