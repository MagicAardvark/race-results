import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import EventsPage from "./page";
import { publicCalendarService } from "@/services/calendar/public-calendar.service";

vi.mock("@/services/calendar/public-calendar.service", () => ({
    publicCalendarService: {
        getPublicCalendar: vi.fn().mockResolvedValue({
            past: [],
            upcoming: [
                {
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
                },
            ],
        }),
    },
}));

describe("Events page", () => {
    it("renders page title and description", async () => {
        const jsx = await EventsPage();
        render(jsx);

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            "Events"
        );
        expect(
            screen.getByText(/Upcoming and past events from all clubs/)
        ).toBeVisible();
    });

    it("renders Upcoming Events section", async () => {
        vi.mocked(publicCalendarService.getPublicCalendar).mockResolvedValue({
            past: [],
            upcoming: [],
        });

        const jsx = await EventsPage();
        render(jsx);

        expect(
            screen.getByRole("heading", { name: "Upcoming Events" })
        ).toBeVisible();

        expect(
            screen.getByText("No upcoming events scheduled. Check back soon.")
        ).toBeVisible();
    });

    it("does not show Past Events when there are no past events", async () => {
        const jsx = await EventsPage();
        render(jsx);

        expect(
            screen.queryByRole("heading", { name: "Past Events" })
        ).not.toBeInTheDocument();
    });
});
