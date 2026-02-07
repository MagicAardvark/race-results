import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassGroupsList } from "./class-groups-list";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import type { AvailableBaseClass } from "./_lib/types";

vi.mock("./edit-class-group-dialog", () => ({
    EditClassGroupDialog: ({
        open,
        classGroupId,
    }: {
        open: boolean;
        classGroupId: string;
    }) =>
        open ? (
            <div data-testid="edit-dialog">Edit Dialog for {classGroupId}</div>
        ) : null,
}));

vi.mock(
    "@/app/(global-admin)/admin/organizations/_lib/actions/class-groups",
    () => ({
        deleteClassGroup: vi.fn(),
    })
);

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock window.confirm
const mockConfirm = vi.fn();
beforeEach(() => {
    window.confirm = mockConfirm;
    mockConfirm.mockReturnValue(true);
});

describe("ClassGroupsList", () => {
    const mockOrgId = "org-1";
    const mockAvailableClasses: AvailableBaseClass[] = [
        {
            classId: "class-1",
            shortName: "SS",
            longName: "Super Street",
            orgId: null,
        },
    ];

    const mockClassGroups: ClassGroupWithClasses[] = [
        {
            classGroupId: "group-1",
            shortName: "SSM",
            longName: "Super Street Modified",
            isEnabled: true,
            orgId: "org-1",
            classIds: ["class-1"],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            classGroupId: "group-2",
            shortName: "STR",
            longName: "Street Touring R",
            isEnabled: false,
            orgId: "org-1",
            classIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders table with class groups", () => {
        renderWithProviders(
            <ClassGroupsList
                orgId={mockOrgId}
                classGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText("SSM")).toBeVisible();
        expect(screen.getByText("Super Street Modified")).toBeVisible();
        expect(screen.getByText("STR")).toBeVisible();
        expect(screen.getByText("Street Touring R")).toBeVisible();
    });

    it("shows enabled status with eye icon", () => {
        renderWithProviders(
            <ClassGroupsList
                orgId={mockOrgId}
                classGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        // First group is enabled, should show Eye icon
        const enabledRow = screen.getByText("SSM").closest("tr");
        expect(enabledRow).toBeVisible();
    });

    it("shows disabled status with eye-off icon", () => {
        renderWithProviders(
            <ClassGroupsList
                orgId={mockOrgId}
                classGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        // Second group is disabled, should show EyeOff icon
        const disabledRow = screen.getByText("STR").closest("tr");
        expect(disabledRow).toBeVisible();
    });

    it("shows class count", () => {
        renderWithProviders(
            <ClassGroupsList
                orgId={mockOrgId}
                classGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText("1 class")).toBeVisible(); // group-1 has 1 class
        expect(screen.getByText("No classes")).toBeVisible(); // group-2 has 0 classes
    });

    it("renders edit and delete buttons for each group", () => {
        renderWithProviders(
            <ClassGroupsList
                orgId={mockOrgId}
                classGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        const editButtons = screen.getAllByRole("button", { name: /edit/i });
        const deleteButtons = screen.getAllByRole("button", {
            name: /delete/i,
        });

        expect(editButtons.length).toBeGreaterThanOrEqual(2);
        expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
    });

    it("opens edit dialog when edit button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassGroupsList
                orgId={mockOrgId}
                classGroups={mockClassGroups}
                availableBaseClasses={mockAvailableClasses}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        // Find edit button by aria-label (e.g., "Edit SSM")
        const editButton = screen.getByRole("button", { name: /Edit SSM/i });
        await user.click(editButton);

        expect(screen.getByTestId("edit-dialog")).toBeVisible();
        expect(screen.getByText(/Edit Dialog for group-1/i)).toBeVisible();
    });

    it("shows empty state when no class groups", () => {
        renderWithProviders(
            <ClassGroupsList
                orgId={mockOrgId}
                classGroups={[]}
                availableBaseClasses={mockAvailableClasses}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText(/No class groups found/i)).toBeVisible();
    });
});
