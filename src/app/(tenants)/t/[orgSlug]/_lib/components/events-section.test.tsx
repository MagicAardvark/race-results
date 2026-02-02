import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { EventsSection } from "./events-section";

describe("EventsSection", () => {
    it("renders title and uses id for aria-labelledby", () => {
        render(
            <EventsSection
                id="upcoming-events"
                title="Upcoming Events"
                variant="primary"
                hasItems={false}
            />
        );

        expect(
            screen.getByRole("heading", { name: "Upcoming Events" })
        ).toBeVisible();
        const section = screen.getByRole("region", {
            name: "Upcoming Events",
        });
        expect(section).toBeInTheDocument();
    });

    it("shows empty message when hasItems is false", () => {
        render(
            <EventsSection
                id="upcoming-events"
                title="Upcoming Events"
                variant="primary"
                hasItems={false}
                emptyMessage="No upcoming events."
            />
        );

        expect(screen.getByText("No upcoming events.")).toBeVisible();
    });

    it("renders only heading when hasItems is true (list is rendered by parent)", () => {
        render(
            <EventsSection
                id="upcoming-events"
                title="Upcoming Events"
                variant="primary"
                hasItems
            />
        );

        expect(
            screen.getByRole("heading", { name: "Upcoming Events" })
        ).toBeVisible();
        expect(screen.queryByTestId("event-list")).not.toBeInTheDocument();
    });

    it("uses default empty message when not provided", () => {
        render(
            <EventsSection
                id="past-events"
                title="Past Events"
                variant="muted"
                hasItems={false}
            />
        );

        expect(
            screen.getByText("No events scheduled. Check back soon.")
        ).toBeVisible();
    });
});
