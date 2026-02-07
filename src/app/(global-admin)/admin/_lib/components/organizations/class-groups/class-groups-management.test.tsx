import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassGroupsManagement } from "./class-groups-management";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import type { AvailableBaseClass } from "./_lib/types";

vi.mock("./class-groups-list", () => ({
    ClassGroupsList: ({
        classGroups,
    }: {
        classGroups: ClassGroupWithClasses[];
        onUpdate: (group: ClassGroupWithClasses) => void;
        onDelete: (id: string) => void;
    }) => (
        <div data-testid="class-groups-list">
            {classGroups.length === 0 ? (
                <div>No groups</div>
            ) : (
                classGroups.map((g) => (
                    <div
                        key={g.classGroupId}
                        data-testid={`group-${g.classGroupId}`}
                    >
                        {g.shortName}
                    </div>
                ))
            )}
        </div>
    ),
}));

vi.mock("./create-class-group-dialog", () => ({
    CreateClassGroupDialog: ({
        open,
        onSuccess,
        onOpenChange,
    }: {
        open: boolean;
        onSuccess: (group: ClassGroupWithClasses) => void;
        onOpenChange: (open: boolean) => void;
    }) =>
        open ? (
            <div data-testid="create-dialog">
                <button onClick={() => onOpenChange(false)}>Close</button>
                <button
                    data-testid="create-dialog-submit"
                    onClick={() =>
                        onSuccess({
                            classGroupId: "new-group",
                            shortName: "NEW",
                            longName: "New Group",
                            isEnabled: true,
                            orgId: "org-1",
                            classIds: [],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })
                    }
                >
                    Create
                </button>
            </div>
        ) : null,
}));

describe("ClassGroupsManagement", () => {
    const mockOrgId = "org-1";
    const mockInitialGroups: ClassGroupWithClasses[] = [
        {
            classGroupId: "group-1",
            shortName: "SSM",
            longName: "Super Street Modified",
            isEnabled: true,
            orgId: "org-1",
            classIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockAvailableClasses: AvailableBaseClass[] = [
        {
            classId: "class-1",
            shortName: "SS",
            longName: "Super Street",
            orgId: null,
        },
    ];
    // These are defined for potential future use but not currently used in tests
    const _mockOnUpdate = vi.fn();
    const _mockOnDelete = vi.fn();

    it("renders card with title", () => {
        renderWithProviders(
            <ClassGroupsManagement
                orgId={mockOrgId}
                initialClassGroups={mockInitialGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        expect(screen.getByText("Class Groups")).toBeVisible();
    });

    it("renders create button", () => {
        renderWithProviders(
            <ClassGroupsManagement
                orgId={mockOrgId}
                initialClassGroups={mockInitialGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        expect(
            screen.getByRole("button", { name: /Create Group/i })
        ).toBeVisible();
    });

    it("renders initial class groups", () => {
        renderWithProviders(
            <ClassGroupsManagement
                orgId={mockOrgId}
                initialClassGroups={mockInitialGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        expect(screen.getByTestId("group-group-1")).toBeVisible();
        expect(screen.getByText("SSM")).toBeVisible();
    });

    it("opens create dialog when create button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassGroupsManagement
                orgId={mockOrgId}
                initialClassGroups={mockInitialGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        const createButton = screen.getByRole("button", {
            name: /Create Group/i,
        });
        await user.click(createButton);

        expect(screen.getByTestId("create-dialog")).toBeVisible();
    });

    it("adds new class group when created", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassGroupsManagement
                orgId={mockOrgId}
                initialClassGroups={mockInitialGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        const createButton = screen.getByRole("button", {
            name: /Create Group/i,
        });
        await user.click(createButton);

        // Get the Create button inside the dialog using test id
        const createButtonInDialog = screen.getByTestId("create-dialog-submit");
        await user.click(createButtonInDialog);

        expect(screen.getByTestId("group-new-group")).toBeVisible();
        expect(screen.getByText("NEW")).toBeVisible();
    });

    it("closes create dialog after successful creation", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassGroupsManagement
                orgId={mockOrgId}
                initialClassGroups={mockInitialGroups}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        const createButton = screen.getByRole("button", {
            name: /Create Group/i,
        });
        await user.click(createButton);

        // Get the Create button inside the dialog using test id
        const createButtonInDialog = screen.getByTestId("create-dialog-submit");
        await user.click(createButtonInDialog);

        expect(screen.queryByTestId("create-dialog")).not.toBeInTheDocument();
    });

    it("shows empty state when no initial groups", () => {
        renderWithProviders(
            <ClassGroupsManagement
                orgId={mockOrgId}
                initialClassGroups={[]}
                availableBaseClasses={mockAvailableClasses}
            />
        );

        expect(screen.getByText("No groups")).toBeVisible();
    });
});
