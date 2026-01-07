import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import Page from "./page";

vi.mock("../_lib/components/my-stats/my-stats", () => ({
    MyStats: () => <div data-testid="my-stats">My Stats</div>,
}));

describe("MePage", () => {
    it("renders MyStats component", () => {
        render(<Page />);

        expect(screen.getByTestId("my-stats")).toBeVisible();
    });
});
