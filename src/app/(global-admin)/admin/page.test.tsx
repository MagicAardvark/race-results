import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import Page from "./page";

describe("AdminPage", () => {
    it("renders admin dashboard heading", async () => {
        const PageComponent = await Page();
        render(PageComponent);

        expect(screen.getByText("Admin Dashboard")).toBeVisible();
    });

    it("renders description", async () => {
        const PageComponent = await Page();
        render(PageComponent);

        expect(
            screen.getByText(
                "Manage organizations, users, and platform settings."
            )
        ).toBeVisible();
    });
});
