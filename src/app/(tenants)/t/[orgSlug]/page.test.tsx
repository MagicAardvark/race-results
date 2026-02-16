import { describe, it, expect, vi } from "vitest";
import {
    defaultOrg,
    renderWithProviders,
    screen,
} from "@/__tests__/test-utils";
import { HEADERS } from "@/constants/global";
import { tenantService } from "@/services/tenants/tenant.service";
import Page from "./page";

vi.mock("@/services/tenants/tenant.service", () => ({
    tenantService: {
        getTenant: vi.fn(),
    },
}));
vi.mock("@/db/repositories/org-events.repo", () => ({
    orgEventsRepository: {
        listByOrgIdAndSeasonId: vi.fn().mockResolvedValue([]),
    },
}));
vi.mock("@/services/events/seasons.service", () => ({
    seasonsService: {
        getSeasonsForOrg: vi.fn().mockResolvedValue([
            {
                seasonId: "season-1",
                orgId: defaultOrg.orgId,
                name: "Current",
                slug: "current",
                startDate: "2025-01-01",
                endDate: "2025-12-31",
                isCurrent: true,
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

vi.mock("next/headers", () => ({
    headers: vi.fn().mockResolvedValue({
        get: (name: string) =>
            name === HEADERS.TENANT.BASE_PATH ? "/t/test-org" : null,
    }),
}));

describe("Tenant org page", () => {
    it("renders org name and events section when tenant is valid", async () => {
        vi.mocked(tenantService.getTenant).mockResolvedValue(defaultOrg);

        const jsx = await Page();
        renderWithProviders(jsx, { org: defaultOrg });

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            "Test Organization"
        );
        expect(screen.getByText("Test description")).toBeVisible();
        expect(
            screen.getByRole("heading", { name: "Upcoming Events" })
        ).toBeVisible();
        expect(
            screen.getByText("No upcoming events scheduled. Check back soon.")
        ).toBeVisible();
    });

    it("renders Back to Organizations and Live Timing links", async () => {
        vi.mocked(tenantService.getTenant).mockResolvedValue(defaultOrg);

        const jsx = await Page();
        renderWithProviders(jsx, { org: defaultOrg });

        expect(
            screen.getByRole("link", { name: /Back to Organizations/ })
        ).toHaveAttribute("href", "/");
        expect(
            screen.getByRole("link", { name: /Live Timing/ })
        ).toHaveAttribute("href", "/t/test-org/live");
    });
});
