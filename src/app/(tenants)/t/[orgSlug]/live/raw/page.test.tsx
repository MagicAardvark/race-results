import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import Page from "./page";

vi.mock("../_lib/components/raw-results/raw-results", () => ({
    RawResults: () => <div data-testid="raw-results">Raw Results</div>,
}));

describe("RawPage", () => {
    it("renders RawResults component", () => {
        render(<Page />);

        expect(screen.getByTestId("raw-results")).toBeVisible();
    });
});
