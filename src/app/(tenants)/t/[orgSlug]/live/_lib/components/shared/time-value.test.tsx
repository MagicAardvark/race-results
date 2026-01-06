import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { TimeValue } from "./time-value";

describe("TimeValue", () => {
    it("displays label and numeric value", () => {
        renderWithProviders(<TimeValue label="Time" value={45.123} />);

        expect(screen.getByText(/time/i)).toBeVisible();
        expect(screen.getByText("45.123")).toBeVisible();
    });

    it("displays string value", () => {
        renderWithProviders(<TimeValue label="Time" value="45.123" />);

        expect(screen.getByText("45.123")).toBeVisible();
    });

    it("displays N/A for null value", () => {
        renderWithProviders(<TimeValue label="Time" value={null} />);

        expect(screen.getByText("N/A")).toBeVisible();
    });

    it("displays N/A for undefined value", () => {
        renderWithProviders(<TimeValue label="Time" value={undefined} />);

        expect(screen.getByText("N/A")).toBeVisible();
    });

    it("displays secondary label and value when provided", () => {
        renderWithProviders(
            <TimeValue
                label="Time"
                value={45.123}
                secondaryLabel="Gap"
                secondaryValue="+0.500"
            />
        );

        expect(screen.getByText(/gap/i)).toBeVisible();
        expect(screen.getByText("+0.500")).toBeVisible();
    });

    it("uses custom formatValue function", () => {
        renderWithProviders(
            <TimeValue
                label="Time"
                value={45.123456}
                formatValue={(v) => v.toFixed(1)}
            />
        );

        expect(screen.getByText("45.1")).toBeVisible();
    });

    it("handles zero value", () => {
        renderWithProviders(<TimeValue label="Time" value={0} />);

        expect(screen.getByText("0.000")).toBeVisible();
    });
});
