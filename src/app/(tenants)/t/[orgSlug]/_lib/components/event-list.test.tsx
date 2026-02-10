import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { EventList } from "./event-list";
import type { EventListItem } from "./event-list";

const baseOrgEvent = {
    eventId: "evt-1",
    seasonId: "season-1",
    msrEventId: null,
    orgId: "org-1",
    name: "Org Event",
    slug: "org-event",
    startAt: new Date("2026-06-10"),
    endAt: new Date("2026-06-10"),
    createdAt: new Date(),
    updatedAt: new Date(),
};

const baseMrEvent = {
    id: "mr-1",
    name: "MR Event",
    type: "autocross",
    start: "2026-06-15",
    end: "2026-06-15",
    detailuri: "https://example.com/event",
    venue: { id: "v1", name: "Track", city: "Boston", region: "MA" },
};

function createOrgItem(overrides: Partial<EventListItem> = {}): EventListItem {
    return {
        source: "org",
        orgEvent: baseOrgEvent,
        mrEvent: undefined,
        ...overrides,
    } as EventListItem;
}

function createMrItem(overrides: Partial<EventListItem> = {}): EventListItem {
    return {
        source: "mr",
        event: baseMrEvent,
        ...overrides,
    } as EventListItem;
}

describe("EventList", () => {
    it("renders org event with coming soon when no MR link", () => {
        const items: EventListItem[] = [
            createOrgItem({
                orgEvent: {
                    ...baseOrgEvent,
                    name: "Test Org Event",
                    msrEventId: null,
                },
            }),
        ];
        render(<EventList items={items} variant="upcoming" />);

        expect(screen.getByText("Test Org Event")).toBeVisible();
        expect(screen.getByText("Sign up coming soon")).toBeVisible();
    });

    it("renders org event with link when MR event provided", () => {
        const items: EventListItem[] = [
            createOrgItem({
                mrEvent: {
                    ...baseMrEvent,
                    detailuri: "https://motorsportreg.com/event/1",
                },
            }),
        ];
        render(<EventList items={items} variant="upcoming" />);

        expect(screen.getByText("Org Event")).toBeVisible();
        const link = screen.getByRole("link", { name: /View event & sign up/ });
        expect(link).toHaveAttribute(
            "href",
            "https://motorsportreg.com/event/1"
        );
    });

    it("renders MR-only event with link", () => {
        const items: EventListItem[] = [
            createMrItem({ event: { ...baseMrEvent, name: "MR Only Event" } }),
        ];
        render(<EventList items={items} variant="upcoming" />);

        expect(screen.getByText("MR Only Event")).toBeVisible();
        expect(
            screen.getByRole("link", { name: /View event & sign up/ })
        ).toBeVisible();
    });

    it("renders past variant with View event label", () => {
        const items: EventListItem[] = [
            createMrItem({
                event: { ...baseMrEvent, name: "Past MR Event" },
            }),
        ];
        render(<EventList items={items} variant="past" />);

        expect(screen.getByText("Past MR Event")).toBeVisible();
        expect(screen.getByRole("link", { name: "View event" })).toBeVisible();
    });

    it("renders organization when item has orgName", () => {
        const items: EventListItem[] = [
            createOrgItem({ orgName: "Boston BMW", orgSlug: "boston-bmw" }),
        ];
        render(<EventList items={items} variant="upcoming" />);

        expect(screen.getByText("Boston BMW")).toBeVisible();
        expect(screen.getByText("Org Event")).toBeVisible();
    });

    it("renders multiple items as list", () => {
        const items: EventListItem[] = [
            createOrgItem({
                orgEvent: { ...baseOrgEvent, eventId: "e1", name: "First" },
            }),
            createOrgItem({
                orgEvent: { ...baseOrgEvent, eventId: "e2", name: "Second" },
            }),
        ];
        const { container } = render(
            <EventList items={items} variant="upcoming" />
        );

        expect(screen.getByText("First")).toBeVisible();
        expect(screen.getByText("Second")).toBeVisible();
        const list = container.querySelector("ul");
        expect(list).toBeInTheDocument();
        expect(list?.children).toHaveLength(2);
    });
});
