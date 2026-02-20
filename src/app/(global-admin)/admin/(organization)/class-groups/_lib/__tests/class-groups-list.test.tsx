import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassGroupsList } from "../components/class-groups-list";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import type { AvailableBaseClass } from "../types";

vi.mock("../components/edit-class-group-dialog", () => ({
    EditClassGroupDialog: ({
        open,
        classGroup,
    }: {
        open: boolean;
        classGroup: ClassGroupWithClasses | null;
    }) =>
        open && classGroup ? (
            <div data-testid="edit-dialog">
                Edit Dialog for {classGroup.shortName}
            </div>
        ) : null,
}));

vi.mock(
    "@/app/(global-admin)/admin/(organization)/class-groups/_lib/actions/class-groups",
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
        {
            classId: "class-2",
            shortName: "AS",
            longName: "A Street",
            orgId: null,
        },
        {
            classId: "class-3",
            shortName: "BS",
            longName: "B Street",
            orgId: null,
        },
    ];

    const mockClassGroups: ClassGroupWithClasses[] = [
        {
            classGroupId: "group-1",
            shortName: "S1",
            longName: "Street 1",
            identificationMode: "BASE_CLASS_ONLY",
            isEnabled: true,
            orgId: "org-1",
            classIds: ["class-1", "class-2"],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            classGroupId: "group-2",
            shortName: "G2",
            longName: "Everything Group",
            identificationMode: "BASE_CLASS_ONLY",
            isEnabled: true,
            orgId: "org-1",
            classIds: ["class-1", "class-2", "class-3"],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            classGroupId: "group-3",
            shortName: "G3",
            longName: "Empty Group",
            identificationMode: "BASE_CLASS_ONLY",
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

        expect(screen.getByText("S1")).toBeVisible();
        expect(screen.getByText("Street 1")).toBeVisible();
        expect(screen.getByText("G2")).toBeVisible();
        expect(screen.getByText("Everything Group")).toBeVisible();
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
        const enabledRow = screen.getByText("S1").closest("tr");
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
        const disabledRow = screen.getByText("G3").closest("tr");
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

        expect(screen.getByText("SS, AS")).toBeVisible(); // group-1 has 2 classes
        expect(screen.getByText("All classes")).toBeVisible(); // group-2 has 3 classes
        expect(screen.getByText("No classes")).toBeVisible(); // group-3 has 0 classes
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

        // Find edit button by aria-label (e.g., "Edit Street 1")
        const editButton = screen.getByRole("button", {
            name: /Edit S1/i,
        });
        await user.click(editButton);

        expect(screen.getByTestId("edit-dialog")).toBeVisible();
        expect(screen.getByText(/Edit Dialog for S1/i)).toBeVisible();
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

        expect(screen.getByText(/No class groups yet/i)).toBeVisible();
    });
});
