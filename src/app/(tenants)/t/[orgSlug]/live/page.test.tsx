import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import Page from "./page";

vi.mock("./_lib/components/class-results/class-results", () => ({
    ClassResults: () => <div data-testid="class-results">Class Results</div>,
}));

describe("LivePage", () => {
    it("renders ClassResults component", () => {
        render(<Page />);

        expect(screen.getByTestId("class-results")).toBeVisible();
    });
});
