import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import Page from "./page";

vi.mock("../_lib/components/work-run/work-run-order", () => ({
    WorkRunOrder: () => <div data-testid="work-run-order">Work Run Order</div>,
}));

describe("WorkRunPage", () => {
    it("renders WorkRunOrder component", () => {
        render(<Page />);

        expect(screen.getByTestId("work-run-order")).toBeVisible();
    });
});
