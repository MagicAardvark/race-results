import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { PositionTimeCard } from "./position-time-card";

describe("PositionTimeCard", () => {
    it("renders title and position", () => {
        render(
            <PositionTimeCard title="Test Title" position={1} time={45.123} />
        );

        expect(screen.getByText("Test Title")).toBeVisible();
        expect(screen.getByText("1")).toBeVisible();
    });

    it("renders time when provided", () => {
        render(<PositionTimeCard title="Test" position={1} time={45.123} />);

        expect(screen.getByText("45.123")).toBeVisible();
        expect(screen.getByText("Time")).toBeVisible();
    });

    it("renders custom time label", () => {
        render(
            <PositionTimeCard
                title="Test"
                position={1}
                time={45.123}
                timeLabel="Best Time"
            />
        );

        expect(screen.getByText("Best Time")).toBeVisible();
    });

    it("does not render time when null", () => {
        render(<PositionTimeCard title="Test" position={1} time={null} />);

        expect(screen.queryByText("Time")).not.toBeInTheDocument();
    });

    it("renders gap to first when provided", () => {
        render(
            <PositionTimeCard
                title="Test"
                position={1}
                time={45.123}
                gapToFirst={0.5}
            />
        );

        expect(screen.getByText(/0\.500s from first/i)).toBeVisible();
    });

    it("renders empty string when gap is zero and no gapLabel provided", () => {
        const { container } = render(
            <PositionTimeCard
                title="Test"
                position={1}
                time={45.123}
                gapToFirst={0}
            />
        );

        // When gap is 0 and no gapLabel, component shows empty string
        // The gap paragraph element exists but is empty
        const gapElement = container.querySelector(
            "p.text-muted-foreground.mt-1"
        );
        expect(gapElement).toBeInTheDocument();
        expect(gapElement?.textContent).toBe("");
    });

    it("renders custom gap label when gap is zero", () => {
        render(
            <PositionTimeCard
                title="Test"
                position={1}
                time={45.123}
                gapToFirst={0}
                gapLabel="First Place"
            />
        );

        expect(screen.getByText("First Place")).toBeVisible();
    });

    it("renders N/A for null position", () => {
        render(<PositionTimeCard title="Test" position={null} time={45.123} />);

        expect(screen.getByText("N/A")).toBeVisible();
    });

    it("renders number position as string", () => {
        render(<PositionTimeCard title="Test" position={5} time={45.123} />);

        expect(screen.getByText("5")).toBeVisible();
    });
});
