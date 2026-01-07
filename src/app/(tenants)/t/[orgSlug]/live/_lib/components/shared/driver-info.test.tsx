import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { DriverInfo } from "./driver-info";

describe("DriverInfo", () => {
    it("renders driver name", () => {
        renderWithProviders(
            <DriverInfo
                carClass="SS"
                number="35"
                name="Sarah Johnson"
                car="2022 Porsche GT4"
                color="Frozen Berry"
            />
        );

        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("renders car class and number", () => {
        renderWithProviders(
            <DriverInfo
                carClass="SS"
                number="35"
                name="Sarah Johnson"
                car="2022 Porsche GT4"
                color="Frozen Berry"
            />
        );

        expect(screen.getByText(/SS #35/i)).toBeVisible();
    });

    it("renders car information", () => {
        renderWithProviders(
            <DriverInfo
                carClass="SS"
                number="35"
                name="Sarah Johnson"
                car="2022 Porsche GT4"
                color="Frozen Berry"
            />
        );

        expect(screen.getByText("2022 Porsche GT4")).toBeVisible();
    });

    it("renders color when provided", () => {
        renderWithProviders(
            <DriverInfo
                carClass="SS"
                number="35"
                name="Sarah Johnson"
                car="2022 Porsche GT4"
                color="Frozen Berry"
            />
        );

        expect(screen.getByText("Frozen Berry")).toBeVisible();
    });

    it("does not render color when empty", () => {
        renderWithProviders(
            <DriverInfo
                carClass="SS"
                number="35"
                name="Sarah Johnson"
                car="2022 Porsche GT4"
                color=""
            />
        );

        expect(screen.queryByText(/Frozen Berry/i)).not.toBeInTheDocument();
    });

    it("handles number as string", () => {
        renderWithProviders(
            <DriverInfo
                carClass="SS"
                number="35"
                name="Sarah Johnson"
                car="2022 Porsche GT4"
                color="Frozen Berry"
            />
        );

        expect(screen.getByText(/SS #35/i)).toBeVisible();
    });

    it("handles number as number", () => {
        renderWithProviders(
            <DriverInfo
                carClass="SS"
                number={35}
                name="Sarah Johnson"
                car="2022 Porsche GT4"
                color="Frozen Berry"
            />
        );

        expect(screen.getByText(/SS #35/i)).toBeVisible();
    });
});
