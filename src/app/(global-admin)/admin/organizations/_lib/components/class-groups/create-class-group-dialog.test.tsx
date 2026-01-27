import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { CreateClassGroupDialog } from "./create-class-group-dialog";
import type { AvailableBaseClass } from "./_lib/types";

vi.mock(
    "@/app/(global-admin)/admin/organizations/_lib/actions/class-groups",
    () => ({
        createClassGroup: vi.fn(),
    })
);

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("CreateClassGroupDialog", () => {
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
            shortName: "STR",
            longName: "Street Touring R",
            orgId: "org-1",
        },
    ];

    const mockOnSuccess = vi.fn();
    const mockOnOpenChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders dialog when open", () => {
        renderWithProviders(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByText("Create Class Group")).toBeVisible();
        expect(
            screen.getByText(/Create a new class group for this organization/i)
        ).toBeVisible();
    });

    it("does not render when closed", () => {
        renderWithProviders(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={false}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        expect(
            screen.queryByText("Create Class Group")
        ).not.toBeInTheDocument();
    });

    it("renders form fields", () => {
        renderWithProviders(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByLabelText("Short Name")).toBeVisible();
        expect(screen.getByLabelText("Long Name")).toBeVisible();
        expect(screen.getByText("Classes")).toBeVisible();
    });

    it("renders available classes", () => {
        renderWithProviders(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByText(/SS - Super Street/i)).toBeVisible();
        expect(screen.getByText(/STR - Street Touring R/i)).toBeVisible();
    });

    it("renders cancel and create buttons", () => {
        renderWithProviders(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByRole("button", { name: /Cancel/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /Create/i })).toBeVisible();
    });

    it("closes dialog when cancel is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        const cancelButton = screen.getByRole("button", { name: /Cancel/i });
        await user.click(cancelButton);

        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("resets form when dialog closes", async () => {
        const user = userEvent.setup();
        const { rerender } = renderWithProviders(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        const shortNameInput = screen.getByLabelText("Short Name");
        await user.type(shortNameInput, "TEST");

        // Close dialog
        const cancelButton = screen.getByRole("button", { name: /Cancel/i });
        await user.click(cancelButton);

        // Reopen dialog
        rerender(
            <CreateClassGroupDialog
                orgId={mockOrgId}
                availableBaseClasses={mockAvailableClasses}
                open={true}
                onOpenChange={mockOnOpenChange}
                onSuccess={mockOnSuccess}
            />
        );

        // Form should be reset
        expect(screen.getByLabelText("Short Name")).toHaveValue("");
    });
});
