import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import Page from "./page";

describe("TenantNotFoundPage", () => {
    it("renders tenant not found message", () => {
        render(<Page />);

        expect(screen.getByText("Tenant not found")).toBeVisible();
    });

    it("renders in a div", () => {
        const { container } = render(<Page />);

        expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });
});
