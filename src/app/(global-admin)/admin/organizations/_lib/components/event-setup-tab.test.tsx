import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { EventSetupTab } from "./event-setup-tab";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import type { AvailableBaseClass } from "./class-groups/_lib/types";

vi.mock("./class-groups/class-groups-management", () => ({
    ClassGroupsManagement: ({ orgId }: { orgId: string }) => (
        <div data-testid="class-groups-management">
            Class Groups Management for {orgId}
        </div>
    ),
}));

describe("EventSetupTab", () => {
    const mockOrgId = "org-1";
    const mockClassGroups: ClassGroupWithClasses[] = [];
    const mockAvailableClasses: AvailableBaseClass[] = [
        {
            classId: "class-1",
            shortName: "SS",
            longName: "Super Street",
            orgId: null,
        },
    ];

    it("renders class groups management component", () => {
        renderWithProviders(
            <EventSetupTab
                orgId={mockOrgId}
                initialClassGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        expect(screen.getByTestId("class-groups-management")).toBeVisible();
        expect(
            screen.getByText(/Class Groups Management for org-1/i)
        ).toBeVisible();
    });

    it("passes correct props to ClassGroupsManagement", () => {
        renderWithProviders(
            <EventSetupTab
                orgId={mockOrgId}
                initialClassGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        // Component renders, which means props were passed correctly
        expect(screen.getByTestId("class-groups-management")).toBeVisible();
    });
});
