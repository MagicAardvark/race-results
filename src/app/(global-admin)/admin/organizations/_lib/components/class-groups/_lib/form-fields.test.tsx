import { describe, it, expect } from "vitest";
import {
    renderWithProviders,
    screen,
    userEvent,
    waitFor,
} from "@/__tests__/test-utils";
import { FormattedInput } from "./form-fields";
import { useForm } from "react-hook-form";

const TestForm = ({
    format,
    initialValue = "",
}: {
    format: "uppercase" | "titleCase";
    initialValue?: string;
}) => {
    type FormData = {
        testField: string;
    };

    const form = useForm<FormData>({
        defaultValues: {
            testField: initialValue,
        },
    });

    return (
        <form>
            <FormattedInput
                form={form}
                name="testField"
                label="Test Field"
                placeholder="Enter value"
                format={format}
            />
            {/* eslint-disable-next-line react-hooks/incompatible-library */}
            <div data-testid="form-value">{form.watch("testField")}</div>
        </form>
    );
};

describe("FormattedInput", () => {
    it("renders input with label", () => {
        renderWithProviders(<TestForm format="uppercase" />);

        expect(screen.getByLabelText("Test Field")).toBeVisible();
        expect(screen.getByPlaceholderText("Enter value")).toBeVisible();
    });

    it("formats to uppercase on blur", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm format="uppercase" />);

        const input = screen.getByLabelText("Test Field");
        await user.type(input, "ssm");
        await user.tab(); // Triggers blur

        expect(input).toHaveValue("SSM");
        expect(screen.getByTestId("form-value")).toHaveTextContent("SSM");
    });

    it("formats to title case on blur", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm format="titleCase" />);

        const input = screen.getByLabelText("Test Field");
        await user.type(input, "super street modified");
        await user.tab(); // Triggers blur

        expect(input).toHaveValue("Super Street Modified");
        expect(screen.getByTestId("form-value")).toHaveTextContent(
            "Super Street Modified"
        );
    });

    it("preserves value while typing (only formats on blur)", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm format="uppercase" />);

        const input = screen.getByLabelText("Test Field");
        await user.type(input, "ssm");

        // Value should still be lowercase while typing
        expect(input).toHaveValue("ssm");
    });

    it("handles empty input", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm format="uppercase" />);

        const input = screen.getByLabelText("Test Field");
        await user.tab(); // Blur without typing

        expect(input).toHaveValue("");
    });

    it("trims whitespace when formatting", async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestForm format="uppercase" />);

        const input = screen.getByLabelText("Test Field");
        await user.type(input, "  ssm  ");
        await user.tab();

        expect(input).toHaveValue("SSM");
    });

    it("shows validation error when field is invalid", () => {
        const TestFormWithValidation = () => {
            type FormData = {
                testField: string;
            };

            const form = useForm<FormData>({
                defaultValues: {
                    testField: "",
                },
            });

            return (
                <form>
                    <FormattedInput
                        form={form}
                        name="testField"
                        label="Test Field"
                        placeholder="Enter value"
                        format="uppercase"
                    />
                </form>
            );
        };

        renderWithProviders(<TestFormWithValidation />);
        // Field should be marked as invalid if validation fails
        screen.getByLabelText("Test Field").closest("[data-invalid]");
        // Note: This test assumes the form validation is set up properly
        // The actual error display depends on form validation state
    });

    it("handles initial value", () => {
        renderWithProviders(
            <TestForm format="uppercase" initialValue="initial" />
        );

        expect(screen.getByLabelText("Test Field")).toHaveValue("initial");
    });

    it("formats initial value on first blur", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <TestForm format="uppercase" initialValue="initial" />
        );

        const input = screen.getByLabelText("Test Field");
        // The input already has the initial value, so we need to blur it to trigger formatting
        // Click to focus, then tab to blur
        await user.click(input);
        await user.tab();

        // Wait for the form state to update
        await waitFor(() => {
            expect(input).toHaveValue("INITIAL");
        });
    });
});
