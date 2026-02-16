import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    renderWithProviders,
    screen,
    userEvent,
    waitFor,
} from "@/__tests__/test-utils";
import { EditClassGroupDialog } from "../components/edit-class-group-dialog";
import type { AvailableBaseClass } from "../types";
import type { ClassGroupWithClasses } from "@/dto/class-groups";

const mockUpdateClassGroup = vi.fn();

vi.mock(
    "@/app/(global-admin)/admin/(organization)/class-groups/_lib/actions/class-groups",
    () => ({
        updateClassGroup: (...args: unknown[]) => mockUpdateClassGroup(...args),
    })
);

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("EditClassGroupDialog", () => {
    const mockOrgId = "org-1";
    const mockAvailableClasses: AvailableBaseClass[] = [
        {
            classId: "class-1",
            shortName: "SS",
            longName: "Super Street",
            orgId: null,
        },
    ];

    const mockClassGroup: ClassGroupWithClasses = {
        classGroupId: "group-1",
        shortName: "SSM",
        longName: "Super Street Modified",
        isEnabled: true,
        orgId: mockOrgId,
        classIds: ["class-1"],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockOnSuccess = vi.fn();
    const mockOnOpenChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUpdateClassGroup.mockResolvedValue({
            isError: false,
            message: "Class group updated successfully",
            data: mockClassGroup,
        });
    });

    it("displays class group data from server-fed prop", async () => {
        renderWithProviders(
            <EditClassGroupDialog
                orgId={mockOrgId}
                classGroup={mockClassGroup}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("Edit Class Group")).toBeVisible();
        });

        expect(screen.getByLabelText("Short Name")).toHaveValue("SSM");
        expect(screen.getByLabelText("Long Name")).toHaveValue(
            "Super Street Modified"
        );
        expect(screen.getByLabelText("Is Enabled")).toBeChecked();
    });

    it("shows not found when classGroup is null and open", () => {
        renderWithProviders(
            <EditClassGroupDialog
                orgId={mockOrgId}
                classGroup={null}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByText("Class group not found")).toBeVisible();
    });

    it("renders form fields when class group provided", async () => {
        renderWithProviders(
            <EditClassGroupDialog
                orgId={mockOrgId}
                classGroup={mockClassGroup}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Short Name")).toBeVisible();
        });

        expect(screen.getByLabelText("Long Name")).toBeVisible();
        expect(screen.getByLabelText("Is Enabled")).toBeVisible();
        expect(screen.getByText("Classes")).toBeVisible();
    });

    it("renders cancel and save buttons", async () => {
        renderWithProviders(
            <EditClassGroupDialog
                orgId={mockOrgId}
                classGroup={mockClassGroup}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /Cancel/i })
            ).toBeVisible();
        });

        expect(screen.getByRole("button", { name: /Save/i })).toBeVisible();
    });

    it("closes dialog when cancel is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <EditClassGroupDialog
                orgId={mockOrgId}
                classGroup={mockClassGroup}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /Cancel/i })
            ).toBeVisible();
        });

        const cancelButton = screen.getByRole("button", { name: /Cancel/i });
        await user.click(cancelButton);

        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not render when closed", () => {
        renderWithProviders(
            <EditClassGroupDialog
                orgId={mockOrgId}
                classGroup={mockClassGroup}
                availableBaseClasses={mockAvailableClasses}
                open={false}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.queryByText("Edit Class Group")).not.toBeInTheDocument();
    });
});
