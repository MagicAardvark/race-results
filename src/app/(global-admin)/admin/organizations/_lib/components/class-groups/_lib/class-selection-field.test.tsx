import { describe, it, expect } from "vitest";
import {
    renderWithProviders,
    screen,
    userEvent,
    waitFor,
} from "@/__tests__/test-utils";
import { ClassSelectionField } from "./class-selection-field";
import { useForm } from "react-hook-form";
import type { AvailableBaseClass } from "./types";

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
    {
        classId: "class-3",
        shortName: "BS",
        longName: "B Street",
        orgId: null,
    },
];

const TestForm = ({ initialValue = [] }: { initialValue?: string[] }) => {
    type FormData = {
        classIds: string[];
    };

    const form = useForm<FormData>({
        defaultValues: {
            classIds: initialValue,
        },
    });

    return (
        <form>
            <ClassSelectionField
                form={form}
                name="classIds"
                availableClasses={mockAvailableClasses}
            />
            <div data-testid="form-value">
                {/* eslint-disable-next-line react-hooks/incompatible-library */}
                {JSON.stringify(form.watch("classIds"))}
            </div>
        </form>
    );
};

describe("ClassSelectionField", () => {
    it("renders field label", () => {
        renderWithProviders(<TestForm />);

        expect(screen.getByText("Classes")).toBeVisible();
    });

    it("renders select all and select none buttons", () => {
        renderWithProviders(<TestForm />);

        expect(
            screen.getByRole("button", { name: /Select All/i })
        ).toBeVisible();
        expect(
            screen.getByRole("button", { name: /Select None/i })
        ).toBeVisible();
    });

    it("renders all available classes", () => {
        renderWithProviders(<TestForm />);

        expect(screen.getByText(/SS - Super Street/i)).toBeVisible();
        expect(screen.getByText(/STR - Street Touring R/i)).toBeVisible();
        expect(screen.getByText(/BS - B Street/i)).toBeVisible();
    });

    it("shows global indicator for global classes", () => {
        renderWithProviders(<TestForm />);

        const ssLabel = screen.getByText(/SS - Super Street/i);
        expect(ssLabel.parentElement).toHaveTextContent("(Global)");
    });

    it("shows org indicator for org-specific classes", () => {
        renderWithProviders(<TestForm />);

        const strLabel = screen.getByText(/STR - Street Touring R/i);
        expect(strLabel.parentElement).toHaveTextContent("(Org)");
    });

    it("shows empty state when no classes available", () => {
        const EmptyForm = () => {
            type FormData = {
                classIds: string[];
            };

            const form = useForm<FormData>({
                defaultValues: {
                    classIds: [],
                },
            });

            return (
                <form>
                    <ClassSelectionField
                        form={form}
                        name="classIds"
                        availableClasses={[]}
                    />
                </form>
            );
        };

        renderWithProviders(<EmptyForm />);

        expect(screen.getByText("No available classes")).toBeVisible();
    });

    it("allows selecting a class", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm />);

        // Find checkbox by clicking on the checkbox directly (Radix UI checkbox)
        const ssLabel = screen.getByText(/SS - Super Street/i);
        const checkboxContainer = ssLabel.closest("div");
        const checkbox = checkboxContainer?.querySelector(
            '[data-slot="checkbox"]'
        ) as HTMLElement;

        expect(checkbox).toBeDefined();
        expect(checkbox).toHaveAttribute("aria-checked", "false");

        // Click the checkbox directly, not the label
        await user.click(checkbox);

        await waitFor(() => {
            expect(checkbox).toHaveAttribute("aria-checked", "true");
            expect(screen.getByTestId("form-value")).toHaveTextContent(
                JSON.stringify(["class-1"])
            );
        });
    });

    it("allows deselecting a class", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm initialValue={["class-1"]} />);

        const ssLabel = screen.getByText(/SS - Super Street/i);
        const checkboxContainer = ssLabel.closest("div");
        const checkbox = checkboxContainer?.querySelector(
            '[data-slot="checkbox"]'
        ) as HTMLElement;

        expect(checkbox).toBeDefined();
        expect(checkbox).toHaveAttribute("aria-checked", "true");

        // Click the checkbox directly, not the label
        await user.click(checkbox);

        await waitFor(() => {
            expect(checkbox).toHaveAttribute("aria-checked", "false");
            expect(screen.getByTestId("form-value")).toHaveTextContent(
                JSON.stringify([])
            );
        });
    });

    it("allows selecting multiple classes", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm />);

        const ssLabel = screen.getByText(/SS - Super Street/i);
        const strLabel = screen.getByText(/STR - Street Touring R/i);
        const ssCheckbox = ssLabel
            .closest("div")
            ?.querySelector('[data-slot="checkbox"]') as HTMLElement;
        const strCheckbox = strLabel
            .closest("div")
            ?.querySelector('[data-slot="checkbox"]') as HTMLElement;

        // Click the checkboxes directly
        await user.click(ssCheckbox);
        await user.click(strCheckbox);

        await waitFor(() => {
            expect(ssCheckbox).toHaveAttribute("aria-checked", "true");
            expect(strCheckbox).toHaveAttribute("aria-checked", "true");
            expect(screen.getByTestId("form-value")).toHaveTextContent(
                JSON.stringify(["class-1", "class-2"])
            );
        });
    });

    it("selects all classes when Select All is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm />);

        const selectAllButton = screen.getByRole("button", {
            name: /Select All/i,
        });
        await user.click(selectAllButton);

        // Radix UI checkboxes use data-slot="checkbox" and aria-checked
        const checkboxes = Array.from(
            document.querySelectorAll('[data-slot="checkbox"]')
        );
        checkboxes.forEach((checkbox) => {
            expect(checkbox).toHaveAttribute("aria-checked", "true");
        });

        expect(screen.getByTestId("form-value")).toHaveTextContent(
            JSON.stringify(["class-1", "class-2", "class-3"])
        );
    });

    it("deselects all classes when Select None is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm initialValue={["class-1", "class-2"]} />);

        const selectNoneButton = screen.getByRole("button", {
            name: /Select None/i,
        });
        await user.click(selectNoneButton);

        // Radix UI checkboxes use data-slot="checkbox" and aria-checked
        const checkboxes = Array.from(
            document.querySelectorAll('[data-slot="checkbox"]')
        );
        checkboxes.forEach((checkbox) => {
            expect(checkbox).toHaveAttribute("aria-checked", "false");
        });

        expect(screen.getByTestId("form-value")).toHaveTextContent(
            JSON.stringify([])
        );
    });

    it("preserves existing selections when selecting additional classes", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm initialValue={["class-1"]} />);

        const strLabel = screen.getByText(/STR - Street Touring R/i);
        const strCheckbox = strLabel
            .closest("div")
            ?.querySelector('[data-slot="checkbox"]') as HTMLElement;

        // Click the checkbox directly
        await user.click(strCheckbox);

        // Wait for React to update the form state
        await waitFor(() => {
            expect(screen.getByTestId("form-value")).toHaveTextContent(
                JSON.stringify(["class-1", "class-2"])
            );
        });
    });

    it("handles initial selected classes", () => {
        renderWithProviders(<TestForm initialValue={["class-1", "class-3"]} />);

        const ssLabel = screen.getByText(/SS - Super Street/i);
        const bsLabel = screen.getByText(/BS - B Street/i);
        const ssCheckbox = ssLabel
            .closest("div")
            ?.querySelector('[data-slot="checkbox"]') as HTMLElement;
        const bsCheckbox = bsLabel
            .closest("div")
            ?.querySelector('[data-slot="checkbox"]') as HTMLElement;

        expect(ssCheckbox).toBeDefined();
        expect(bsCheckbox).toBeDefined();
        expect(ssCheckbox).toHaveAttribute("aria-checked", "true");
        expect(bsCheckbox).toHaveAttribute("aria-checked", "true");
    });
});
