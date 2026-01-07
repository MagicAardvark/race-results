import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { DriverSelect } from "./driver-select";

describe("DriverSelect", () => {
    const mockDrivers = [
        {
            id: "driver-1",
            name: "John Doe",
            carClass: "SS",
            number: "1",
            car: "Car A",
            color: "Red",
        },
        {
            id: "driver-2",
            name: "Jane Smith",
            carClass: "CS",
            number: "25",
            car: "Car B",
            color: "Blue",
        },
    ];

    it("renders select with placeholder", () => {
        const mockOnChange = vi.fn();
        renderWithProviders(
            <DriverSelect
                drivers={mockDrivers}
                selectedDriverId={null}
                onDriverChange={mockOnChange}
            />
        );

        expect(screen.getByText("Select a driver")).toBeVisible();
    });

    it("renders select trigger", () => {
        const mockOnChange = vi.fn();
        renderWithProviders(
            <DriverSelect
                drivers={mockDrivers}
                selectedDriverId={null}
                onDriverChange={mockOnChange}
            />
        );

        expect(screen.getByRole("combobox")).toBeVisible();
    });

    it("renders with selected driver id", () => {
        const mockOnChange = vi.fn();
        renderWithProviders(
            <DriverSelect
                drivers={mockDrivers}
                selectedDriverId="driver-2"
                onDriverChange={mockOnChange}
            />
        );

        expect(screen.getByRole("combobox")).toBeVisible();
    });

    it("handles empty drivers array", () => {
        const mockOnChange = vi.fn();
        renderWithProviders(
            <DriverSelect
                drivers={[]}
                selectedDriverId={null}
                onDriverChange={mockOnChange}
            />
        );

        expect(screen.getByText("Select a driver")).toBeVisible();
    });
});
