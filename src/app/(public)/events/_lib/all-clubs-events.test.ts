import { describe, it, expect, vi } from "vitest";
import { mergeAllClubsEvents } from "./all-clubs-events";
import type { EventDTO } from "@/dto/events";
import type { Event as MotorsportRegEvent } from "@/dto/motorsportreg";
import type { Organization } from "@/dto/organizations";

vi.mock("@/app/(tenants)/t/[orgSlug]/_lib/utils/date-utils", () => ({
    getDateString: (d: Date | string) => {
        if (typeof d === "string") return d.slice(0, 10);
        const date = new Date(d);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    },
}));

vi.mock("@/app/(tenants)/t/[orgSlug]/_lib/events/merge-events", () => ({
    mergeOrgAndMrEvents: (
        orgEvents: EventDTO[],
        _mrEvents: MotorsportRegEvent[],
        _today: string
    ) => {
        const upcoming = orgEvents
            .filter((e) => e.endAt >= new Date("2026-06-01"))
            .map((e) => ({
                source: "org" as const,
                orgEvent: e,
                mrEvent: undefined,
            }));
        const past = orgEvents
            .filter((e) => e.endAt < new Date("2026-06-01"))
            .map((e) => ({
                source: "org" as const,
                orgEvent: e,
                mrEvent: undefined,
            }));
        return { upcoming, past };
    },
}));

function org(overrides: Partial<Organization> = {}): Organization {
    return {
        orgId: "org-1",
        name: "Test Org",
        slug: "test-org",
        motorsportregOrgId: null,
        description: null,
        headerImageUrl: null,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}

function orgEvent(
    overrides: Partial<EventDTO> & { startAt: Date; endAt: Date }
): EventDTO {
    return {
        eventId: "evt-1",
        orgId: "org-1",
        name: "Event",
        slug: "event",
        seasonId: "season-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

describe("mergeAllClubsEvents", () => {
    const today = "2026-06-01";

    it("tags each item with org name and slug", () => {
        const orgA = org({ orgId: "org-a", name: "Club A", slug: "club-a" });
        const start = new Date("2026-07-01T00:00:00");
        const end = new Date("2026-07-01T23:59:59");
        const orgsWithOrgEvents = [
            {
                org: orgA,
                orgEvents: [orgEvent({ startAt: start, endAt: end })],
            },
        ];
        const orgsWithMrEvents: {
            org: Organization;
            events: MotorsportRegEvent[];
        }[] = [];

        const { upcoming } = mergeAllClubsEvents(
            orgsWithOrgEvents,
            orgsWithMrEvents,
            today
        );

        expect(upcoming).toHaveLength(1);
        expect(upcoming[0]).toMatchObject({
            orgName: "Club A",
            orgSlug: "club-a",
        });
    });

    it("merges multiple orgs and sorts upcoming by start date", () => {
        const orgA = org({ orgId: "org-a", name: "A", slug: "a" });
        const orgB = org({ orgId: "org-b", name: "B", slug: "b" });
        const july = new Date("2026-07-15T00:00:00");
        const june = new Date("2026-06-15T00:00:00");
        const orgsWithOrgEvents = [
            {
                org: orgA,
                orgEvents: [orgEvent({ startAt: july, endAt: july })],
            },
            {
                org: orgB,
                orgEvents: [orgEvent({ startAt: june, endAt: june })],
            },
        ];
        const orgsWithMrEvents: {
            org: Organization;
            events: MotorsportRegEvent[];
        }[] = [];

        const { upcoming } = mergeAllClubsEvents(
            orgsWithOrgEvents,
            orgsWithMrEvents,
            today
        );

        expect(upcoming).toHaveLength(2);
        expect(upcoming[0]).toMatchObject({ orgSlug: "b" });
        expect(upcoming[1]).toMatchObject({ orgSlug: "a" });
    });

    it("returns empty when no orgs have events", () => {
        const orgsWithOrgEvents = [{ org: org(), orgEvents: [] as EventDTO[] }];
        const orgsWithMrEvents: {
            org: Organization;
            events: MotorsportRegEvent[];
        }[] = [];

        const { upcoming, past } = mergeAllClubsEvents(
            orgsWithOrgEvents,
            orgsWithMrEvents,
            today
        );

        expect(upcoming).toHaveLength(0);
        expect(past).toHaveLength(0);
    });
});
