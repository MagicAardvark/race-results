import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import { CreateOrgDialog } from "./create-org-dialog";
import { createOrganization } from "@/app/actions/organization.actions";

vi.mock("@/app/actions/organization.actions", () => ({
    createOrganization: vi.fn(),
}));

describe("CreateOrgDialog", () => {
    const mockTrigger = <button>Create Organization</button>;

    it("renders dialog with trigger", () => {
        render(<CreateOrgDialog trigger={mockTrigger} />);

        expect(screen.getByText("Create Organization")).toBeVisible();
    });

    it("opens dialog when trigger is clicked", async () => {
        const user = userEvent.setup();
        render(<CreateOrgDialog trigger={mockTrigger} />);

        const trigger = screen.getByText("Create Organization");
        await user.click(trigger);

        expect(
            screen.getByText("Create Organization", { selector: "h2" })
        ).toBeVisible();
    });

    it("renders form fields", async () => {
        const user = userEvent.setup();
        render(<CreateOrgDialog trigger={mockTrigger} />);

        const trigger = screen.getByText("Create Organization");
        await user.click(trigger);

        expect(screen.getByLabelText("Name")).toBeVisible();
        expect(screen.getByPlaceholderText("Pizza Club")).toBeVisible();
    });

    it("renders cancel and create buttons", async () => {
        const user = userEvent.setup();
        render(<CreateOrgDialog trigger={mockTrigger} />);

        const trigger = screen.getByText("Create Organization");
        await user.click(trigger);

        expect(screen.getByRole("button", { name: /Cancel/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /Create/i })).toBeVisible();
    });

    it("submits form with organization name", async () => {
        vi.mocked(createOrganization).mockResolvedValue({
            isError: false,
            message: "",
        });

        const user = userEvent.setup();
        render(<CreateOrgDialog trigger={mockTrigger} />);

        await user.click(screen.getByText("Create Organization"));

        const nameInput = screen.getByLabelText("Name");
        await user.type(nameInput, "New Organization");

        const createButton = screen.getByRole("button", { name: /Create/i });
        await user.click(createButton);

        // Verify the action was called with FormData
        expect(createOrganization).toHaveBeenCalled();
    });

    it("requires name field to be filled", async () => {
        const user = userEvent.setup();
        render(<CreateOrgDialog trigger={mockTrigger} />);

        await user.click(screen.getByText("Create Organization"));

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeRequired();
    });

    it("disables create button while pending", async () => {
        vi.mocked(createOrganization).mockImplementation(
            () => new Promise(() => {}) // Never resolves to keep pending state
        );

        const user = userEvent.setup();
        render(<CreateOrgDialog trigger={mockTrigger} />);

        await user.click(screen.getByText("Create Organization"));

        const nameInput = screen.getByLabelText("Name");
        await user.type(nameInput, "New Organization");

        const createButton = screen.getByRole("button", { name: /Create/i });
        await user.click(createButton);

        // Button should show pending state and be disabled
        expect(
            screen.getByRole("button", { name: /Creating/i })
        ).toBeDisabled();
    });
});
