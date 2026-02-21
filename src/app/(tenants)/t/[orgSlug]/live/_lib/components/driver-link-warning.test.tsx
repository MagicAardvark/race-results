import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { DriverLinkWarning } from "./driver-link-warning";

describe("DriverLinkWarning", () => {
    it("renders warning to select own name", () => {
        renderWithProviders(<DriverLinkWarning />);

        expect(
            screen.getByText(
                /You must select your own name from the list below/
            )
        ).toBeVisible();
        expect(
            screen.getByText(
                /Selecting another driver will result in a broken experience/
            )
        ).toBeVisible();
    });
});
