import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { ValueDisplay } from "./value-display";

describe("ValueDisplay", () => {
    it("renders label and value", () => {
        renderWithProviders(<ValueDisplay label="Position" value={1} />);

        expect(screen.getByText("Position")).toBeVisible();
        expect(screen.getByText("1")).toBeVisible();
    });

    it("renders string value", () => {
        renderWithProviders(<ValueDisplay label="Status" value="Active" />);

        expect(screen.getByText("Active")).toBeVisible();
    });

    it("renders with small size", () => {
        renderWithProviders(
            <ValueDisplay label="Position" value={1} size="sm" />
        );

        const valueElement = screen.getByText("1");
        expect(valueElement).toBeVisible();
        expect(valueElement.className).toMatch(/text-sm/);
    });

    it("renders with medium size by default", () => {
        renderWithProviders(<ValueDisplay label="Position" value={1} />);

        const valueElement = screen.getByText("1");
        expect(valueElement).toBeVisible();
        expect(valueElement.className).toMatch(/text-lg/);
    });

    it("renders with large size", () => {
        renderWithProviders(
            <ValueDisplay label="Position" value={1} size="lg" />
        );

        const valueElement = screen.getByText("1");
        expect(valueElement).toBeVisible();
        expect(valueElement.className).toMatch(/text-2xl/);
    });

    it("applies custom className", () => {
        renderWithProviders(
            <ValueDisplay label="Position" value={1} className="custom-class" />
        );

        const container = screen.getByText("Position").parentElement;
        expect(container?.className).toMatch(/custom-class/);
    });
});
