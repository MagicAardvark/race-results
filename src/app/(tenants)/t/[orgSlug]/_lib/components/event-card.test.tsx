import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { EventCard } from "./event-card";

describe("EventCard", () => {
    it("renders name and dateLabel", () => {
        render(
            <EventCard
                name="Test Event"
                dateLabel="Mon, June 10, 2026"
                variant="upcoming"
            />
        );

        expect(screen.getByText("Test Event")).toBeVisible();
        expect(screen.getByText("Mon, June 10, 2026")).toBeVisible();
    });

    it("renders venue when provided", () => {
        render(
            <EventCard
                name="Test Event"
                dateLabel="Mon, June 10, 2026"
                venue="Devens, Ayer, MA"
                variant="upcoming"
            />
        );

        expect(screen.getByText("Devens, Ayer, MA")).toBeVisible();
    });

    it("renders organization when provided (all-clubs view)", () => {
        render(
            <EventCard
                name="Event 1"
                dateLabel="Mon, June 10, 2026"
                organization="Boston BMW CCA"
                variant="upcoming"
            />
        );

        expect(screen.getByText("Boston BMW CCA")).toBeVisible();
        expect(screen.getByText("Event 1")).toBeVisible();
    });

    it("renders action when provided", () => {
        render(
            <EventCard
                name="Test Event"
                dateLabel="Mon, June 10, 2026"
                action={<button type="button">View event</button>}
                variant="upcoming"
            />
        );

        expect(screen.getByRole("button", { name: "View event" })).toBeVisible();
    });

    it("renders as list item", () => {
        const { container } = render(
            <EventCard
                name="Test Event"
                dateLabel="Mon, June 10, 2026"
                variant="past"
            />
        );

        const li = container.querySelector("li");
        expect(li).toBeInTheDocument();
    });

    it("does not show organization label when organization is not provided", () => {
        render(
            <EventCard
                name="Single Event"
                dateLabel="Mon, June 10, 2026"
                variant="upcoming"
            />
        );

        expect(screen.getByText("Single Event")).toBeVisible();
        expect(screen.queryByText(/Boston/)).not.toBeInTheDocument();
    });
});
