import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { CalendarEvent } from "@/dto/calendar";
import { EventList } from "@/app/(tenants)/t/[orgSlug]/_lib/components";

const baseCalendarEvent = {
    eventId: "evt-1",
    org: {
        orgId: "org-1",
        name: "Test Org",
        slug: "test-org",
    },
    slug: "org-event",
    name: "Org Event",
    description: null,
    startDate: "2026-06-10",
    startTime: "00:00:00",
    endDate: "2026-06-10",
    endTime: "23:59:59",
    msrEventLink: null,
    location: null,
};

function createCalendarItem(
    overrides: Partial<CalendarEvent> = {}
): CalendarEvent {
    return {
        ...baseCalendarEvent,
        ...overrides,
    } as CalendarEvent;
}

describe("EventList", () => {
    it("renders org event with coming soon when no MR link", () => {
        const items: CalendarEvent[] = [
            createCalendarItem({
                name: "Test Org Event",
            }),
        ];
        render(
            <EventList
                items={items}
                variant="upcoming"
                displayMode="combined"
            />
        );

        expect(screen.getByText("Test Org Event")).toBeVisible();
        expect(screen.getByText("Sign up coming soon")).toBeVisible();
    });

    it("renders org event with link when MR event provided", () => {
        const items: CalendarEvent[] = [
            createCalendarItem({
                msrEventLink: "https://motorsportreg.com/event/1",
                location: "Boston, MA",
            }),
        ];
        render(
            <EventList
                items={items}
                variant="upcoming"
                displayMode="combined"
            />
        );

        expect(screen.getByText("Org Event")).toBeVisible();
        const link = screen.getByRole("link", { name: /View event & sign up/ });
        expect(link).toHaveAttribute(
            "href",
            "https://motorsportreg.com/event/1"
        );
    });

    it("renders past variant with View event label", () => {
        const items: CalendarEvent[] = [
            createCalendarItem({
                name: "Past MR Event",
                msrEventLink: "https://motorsportreg.com/event/1",
                location: "Boston, MA",
            }),
        ];
        render(
            <EventList items={items} variant="past" displayMode="combined" />
        );

        expect(screen.getByText("Past MR Event")).toBeVisible();
        expect(screen.getByRole("link", { name: "View event" })).toBeVisible();
    });

    it("renders organization when item has orgName", () => {
        const items: CalendarEvent[] = [
            createCalendarItem({
                org: {
                    orgId: "org-1",
                    name: "Boston BMW",
                    slug: "boston-bmw",
                },
                name: "Org Event",
            }),
        ];

        render(
            <EventList
                items={items}
                variant="upcoming"
                displayMode="combined"
            />
        );

        expect(screen.getByText("Boston BMW")).toBeVisible();
        expect(screen.getByText("Org Event")).toBeVisible();
    });

    it("renders multiple items as list", () => {
        const items: CalendarEvent[] = [
            createCalendarItem({
                org: {
                    orgId: "org-1",
                    name: "Boston BMW",
                    slug: "boston-bmw",
                },
                name: "First",
            }),
            createCalendarItem({
                org: {
                    orgId: "org-1",
                    name: "Boston BMW",
                    slug: "boston-bmw",
                },
                name: "Second",
            }),
        ];
        const { container } = render(
            <EventList
                items={items}
                variant="upcoming"
                displayMode="combined"
            />
        );

        expect(screen.getByText("First")).toBeVisible();
        expect(screen.getByText("Second")).toBeVisible();
        const list = container.querySelector("ul");
        expect(list).toBeInTheDocument();
        expect(list?.children).toHaveLength(2);
    });

    it("renders just event name when displayMode is single-org", () => {
        const items: CalendarEvent[] = [
            createCalendarItem({
                org: {
                    orgId: "org-1",
                    name: "Boston BMW",
                    slug: "boston-bmw",
                },
                name: "Org Event",
            }),
        ];

        render(
            <EventList
                items={items}
                variant="upcoming"
                displayMode="single-org"
            />
        );

        expect(screen.queryByText("Boston BMW")).not.toBeInTheDocument();
        expect(screen.getByText("Org Event")).toBeVisible();
    });
});
