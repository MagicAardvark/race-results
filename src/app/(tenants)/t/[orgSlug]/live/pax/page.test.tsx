import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import Page from "./page";

vi.mock("../_lib/components/pax-results/pax-results", () => ({
    PaxResults: () => <div data-testid="pax-results">PAX Results</div>,
}));

describe("PaxPage", () => {
    it("renders PaxResults component", () => {
        render(<Page />);

        expect(screen.getByTestId("pax-results")).toBeVisible();
    });
});
