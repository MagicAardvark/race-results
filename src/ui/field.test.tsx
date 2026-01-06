import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Field,
    FieldSet,
    FieldLegend,
    FieldGroup,
    FieldContent,
    FieldLabel,
    FieldTitle,
    FieldDescription,
    FieldSeparator,
    FieldError,
} from "./field";

describe("Field", () => {
    it("renders field element", () => {
        renderWithProviders(<Field data-testid="field">Content</Field>);
        const field = screen.getByTestId("field");
        expect(field).toBeVisible();
        expect(field).toHaveAttribute("data-slot", "field");
        expect(field).toHaveAttribute("role", "group");
    });

    it("renders with default vertical orientation", () => {
        renderWithProviders(<Field data-testid="field">Content</Field>);
        const field = screen.getByTestId("field");
        expect(field).toHaveAttribute("data-orientation", "vertical");
    });

    it("renders with horizontal orientation", () => {
        renderWithProviders(
            <Field orientation="horizontal" data-testid="field">
                Content
            </Field>
        );
        const field = screen.getByTestId("field");
        expect(field).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders with responsive orientation", () => {
        renderWithProviders(
            <Field orientation="responsive" data-testid="field">
                Content
            </Field>
        );
        const field = screen.getByTestId("field");
        expect(field).toHaveAttribute("data-orientation", "responsive");
    });
});

describe("FieldSet", () => {
    it("renders fieldset element", () => {
        renderWithProviders(
            <FieldSet data-testid="fieldset">Content</FieldSet>
        );
        const fieldset = screen.getByTestId("fieldset");
        expect(fieldset.tagName).toBe("FIELDSET");
        expect(fieldset).toHaveAttribute("data-slot", "field-set");
    });
});

describe("FieldLegend", () => {
    it("renders legend element", () => {
        renderWithProviders(
            <FieldSet>
                <FieldLegend data-testid="legend">Legend</FieldLegend>
            </FieldSet>
        );
        const legend = screen.getByTestId("legend");
        expect(legend.tagName).toBe("LEGEND");
        expect(legend).toHaveAttribute("data-slot", "field-legend");
        expect(legend).toHaveTextContent("Legend");
    });

    it("renders with default variant", () => {
        renderWithProviders(
            <FieldSet>
                <FieldLegend data-testid="legend">Legend</FieldLegend>
            </FieldSet>
        );
        const legend = screen.getByTestId("legend");
        expect(legend).toHaveAttribute("data-variant", "legend");
    });

    it("renders with label variant", () => {
        renderWithProviders(
            <FieldSet>
                <FieldLegend variant="label" data-testid="legend">
                    Label
                </FieldLegend>
            </FieldSet>
        );
        const legend = screen.getByTestId("legend");
        expect(legend).toHaveAttribute("data-variant", "label");
    });
});

describe("FieldGroup", () => {
    it("renders group element", () => {
        renderWithProviders(
            <FieldGroup data-testid="group">Content</FieldGroup>
        );
        const group = screen.getByTestId("group");
        expect(group).toBeVisible();
        expect(group).toHaveAttribute("data-slot", "field-group");
    });
});

describe("FieldContent", () => {
    it("renders content element", () => {
        renderWithProviders(
            <Field>
                <FieldContent data-testid="content">Content</FieldContent>
            </Field>
        );
        const content = screen.getByTestId("content");
        expect(content).toBeVisible();
        expect(content).toHaveAttribute("data-slot", "field-content");
    });
});

describe("FieldLabel", () => {
    it("renders label element", () => {
        renderWithProviders(
            <Field>
                <FieldLabel htmlFor="input" data-testid="label">
                    Label
                </FieldLabel>
            </Field>
        );
        const label = screen.getByTestId("label");
        expect(label).toBeVisible();
        expect(label).toHaveAttribute("data-slot", "field-label");
        expect(label).toHaveTextContent("Label");
    });
});

describe("FieldTitle", () => {
    it("renders title element", () => {
        renderWithProviders(
            <Field>
                <FieldTitle data-testid="title">Title</FieldTitle>
            </Field>
        );
        const title = screen.getByTestId("title");
        expect(title).toBeVisible();
        expect(title).toHaveAttribute("data-slot", "field-label");
        expect(title).toHaveTextContent("Title");
    });
});

describe("FieldDescription", () => {
    it("renders description element", () => {
        renderWithProviders(
            <Field>
                <FieldDescription data-testid="description">
                    Description
                </FieldDescription>
            </Field>
        );
        const description = screen.getByTestId("description");
        expect(description.tagName).toBe("P");
        expect(description).toHaveAttribute("data-slot", "field-description");
        expect(description).toHaveTextContent("Description");
    });
});

describe("FieldSeparator", () => {
    it("renders separator element", () => {
        renderWithProviders(
            <Field>
                <FieldSeparator data-testid="separator" />
            </Field>
        );
        const separator = screen.getByTestId("separator");
        expect(separator).toBeVisible();
        expect(separator).toHaveAttribute("data-slot", "field-separator");
    });

    it("renders with children", () => {
        renderWithProviders(
            <Field>
                <FieldSeparator data-testid="separator">OR</FieldSeparator>
            </Field>
        );
        const separator = screen.getByTestId("separator");
        expect(separator).toHaveTextContent("OR");
        expect(separator).toHaveAttribute("data-content", "true");
    });
});

describe("FieldError", () => {
    it("renders nothing when no errors or children", () => {
        renderWithProviders(
            <Field>
                <FieldError data-testid="error" />
            </Field>
        );
        expect(screen.queryByTestId("error")).not.toBeInTheDocument();
    });

    it("renders children when provided", () => {
        renderWithProviders(
            <Field>
                <FieldError data-testid="error">Custom error</FieldError>
            </Field>
        );
        const error = screen.getByTestId("error");
        expect(error).toBeVisible();
        expect(error).toHaveAttribute("role", "alert");
        expect(error).toHaveTextContent("Custom error");
    });

    it("renders single error message", () => {
        renderWithProviders(
            <Field>
                <FieldError
                    errors={[{ message: "This field is required" }]}
                    data-testid="error"
                />
            </Field>
        );
        const error = screen.getByTestId("error");
        expect(error).toHaveTextContent("This field is required");
    });

    it("renders multiple error messages as list", () => {
        renderWithProviders(
            <Field>
                <FieldError
                    errors={[{ message: "Error 1" }, { message: "Error 2" }]}
                    data-testid="error"
                />
            </Field>
        );
        const error = screen.getByTestId("error");
        expect(error).toBeVisible();
        const list = error.querySelector("ul");
        expect(list).toBeTruthy();
    });

    it("deduplicates error messages", () => {
        renderWithProviders(
            <Field>
                <FieldError
                    errors={[
                        { message: "Same error" },
                        { message: "Same error" },
                    ]}
                    data-testid="error"
                />
            </Field>
        );
        const error = screen.getByTestId("error");
        expect(error).toHaveTextContent("Same error");
        // Should only show once
        const matches = error.textContent?.match(/Same error/g);
        expect(matches?.length).toBe(1);
    });
});
