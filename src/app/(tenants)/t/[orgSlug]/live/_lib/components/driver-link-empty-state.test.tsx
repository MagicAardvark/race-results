import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { DriverLinkEmptyState } from "./driver-link-empty-state";

describe("DriverLinkEmptyState", () => {
    it("renders message when no drivers in event", () => {
        renderWithProviders(<DriverLinkEmptyState />);

        expect(screen.getByText(/No drivers in this event yet/)).toBeVisible();
        expect(
            screen.getByText(/Check back when results are available/)
        ).toBeVisible();
    });
});
