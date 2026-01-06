import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { StatsGrid } from "./stats-grid";

describe("StatsGrid", () => {
    const mockStats = [
        { label: "Runs", value: 8 },
        { label: "Clean", value: 4 },
        { label: "Cones", value: 9 },
    ];

    it("renders all stats", () => {
        renderWithProviders(<StatsGrid stats={mockStats} />);

        expect(screen.getByText("Runs")).toBeVisible();
        expect(screen.getByText("8")).toBeVisible();
        expect(screen.getByText("Clean")).toBeVisible();
        expect(screen.getByText("4")).toBeVisible();
        expect(screen.getByText("Cones")).toBeVisible();
        expect(screen.getByText("9")).toBeVisible();
    });

    it("renders with 2 columns", () => {
        const { container } = renderWithProviders(
            <StatsGrid stats={mockStats} columns={2} />
        );

        const grid = container.querySelector("div[class*='grid']");
        expect(grid?.className).toMatch(/grid-cols-2/);
    });

    it("renders with 3 columns by default", () => {
        const { container } = renderWithProviders(
            <StatsGrid stats={mockStats} />
        );

        const grid = container.querySelector("div[class*='grid']");
        expect(grid?.className).toMatch(/grid-cols-3/);
    });

    it("renders with 4 columns", () => {
        const { container } = renderWithProviders(
            <StatsGrid stats={mockStats} columns={4} />
        );

        const grid = container.querySelector("div[class*='grid']");
        expect(grid?.className).toMatch(/grid-cols-4/);
    });

    it("renders string values", () => {
        const statsWithStrings = [
            { label: "Status", value: "Active" },
            { label: "Type", value: "Autocross" },
        ];

        renderWithProviders(<StatsGrid stats={statsWithStrings} />);

        expect(screen.getByText("Active")).toBeVisible();
        expect(screen.getByText("Autocross")).toBeVisible();
    });

    it("applies custom className", () => {
        const { container } = renderWithProviders(
            <StatsGrid stats={mockStats} className="custom-class" />
        );

        const grid = container.querySelector("div[class*='grid']");
        expect(grid?.className).toMatch(/custom-class/);
    });

    it("renders empty stats array", () => {
        const { container } = renderWithProviders(<StatsGrid stats={[]} />);

        const grid = container.querySelector("div[class*='grid']");
        expect(grid).toBeInTheDocument();
    });
});
