import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { PositionBadge } from "./position-badge";

describe("PositionBadge", () => {
    it("displays label and value", () => {
        renderWithProviders(<PositionBadge label="Position" value="1" />);

        expect(screen.getByText(/position/i)).toBeVisible();
        expect(screen.getByText("1")).toBeVisible();
    });

    it("displays numeric value", () => {
        renderWithProviders(<PositionBadge label="Position" value={5} />);

        expect(screen.getByText("5")).toBeVisible();
    });

    it("displays secondary label and value when provided", () => {
        renderWithProviders(
            <PositionBadge
                label="Position"
                value="1"
                secondaryLabel="Gap"
                secondaryValue="+0.500"
            />
        );

        expect(screen.getByText(/gap/i)).toBeVisible();
        expect(screen.getByText("+0.500")).toBeVisible();
    });

    it("does not display secondary when not provided", () => {
        renderWithProviders(<PositionBadge label="Position" value="1" />);

        expect(screen.queryByText(/gap/i)).not.toBeInTheDocument();
    });

    it("handles zero value", () => {
        renderWithProviders(<PositionBadge label="Position" value={0} />);

        expect(screen.getByText("0")).toBeVisible();
    });
});
