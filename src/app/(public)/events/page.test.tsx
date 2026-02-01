import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import EventsPage from "./page";

vi.mock("@/db/repositories/org-events.repo", () => ({
    orgEventsRepository: {
        listByOrgId: vi.fn().mockResolvedValue([]),
    },
}));
vi.mock("@/services/organizations/organization.service", () => ({
    organizationService: {
        getAllOrganizations: vi.fn().mockResolvedValue([
            {
                orgId: "org-1",
                name: "Test Org",
                slug: "test-org",
                motorsportregOrgId: "mr-1",
                description: null,
                headerImageUrl: null,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            },
        ]),
    },
}));
vi.mock("@/services/motorsportreg/motorsportreg.service", () => ({
    motorsportRegService: {
        getOrganizationCalendar: vi.fn().mockResolvedValue({
            response: { events: [] },
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
