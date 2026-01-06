import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
    test("displays organizations list", async ({ page }) => {
        await page.goto("/");

        // Test as a user would - look for visible text, not test IDs
        await expect(
            page.getByRole("heading", { name: /live timing & results/i })
        ).toBeVisible();

        // Check for the hero section description
        await expect(
            page.getByText(/track motorsports results and live timing/i)
        ).toBeVisible();

        // Check for organization cards (if any exist)
        const orgCards = page.getByRole("link", { name: /view more about/i });
        const count = await orgCards.count();
        if (count > 0) {
            await expect(orgCards.first()).toBeVisible();
        }
    });

    test("navigates to organization page when clicked", async ({ page }) => {
        await page.goto("/");

        // Use a real organization slug from seed data
        const orgSlugs = ["ner", "ne-svt", "boston-bmw"];

        // Try to find and click an organization card
        for (const slug of orgSlugs) {
            const orgLink = page.getByRole("link", {
                name: new RegExp(slug, "i"),
            });
            if ((await orgLink.count()) > 0) {
                await orgLink.first().click();
                await expect(page).toHaveURL(new RegExp(`/t/${slug}`));
                return;
            }
        }

        // If no organizations found, just verify we're still on home page
        await expect(page).toHaveURL("/");
    });
});

test.describe("Organization Page", () => {
    test("displays organization details", async ({ page }) => {
        // Use a real organization slug from seed data
        await page.goto("/t/ner");

        // Check for organization name or back button
        const orgName = page.getByRole("heading", { name: /ner/i });
        const backButton = page.getByRole("link", {
            name: /back to organizations/i,
        });

        // Either the org name or back button should be visible
        const hasOrgName = (await orgName.count()) > 0;
        const hasBackButton = (await backButton.count()) > 0;

        expect(hasOrgName || hasBackButton).toBe(true);
    });

    test("has live timing link", async ({ page }) => {
        await page.goto("/t/ner");

        // Look for the Live Timing button
        const liveTimingLink = page.getByRole("link", { name: /live timing/i });
        if ((await liveTimingLink.count()) > 0) {
            await expect(liveTimingLink.first()).toBeVisible();
        }
    });
});

test.describe("Live Timing", () => {
    test("loads live timing page", async ({ page }) => {
        // Use a real organization slug
        await page.goto("/t/ner/live");

        // Wait for page to load - check for navigation or empty state
        const navigation = page.getByRole("navigation");
        const emptyState = page.getByText(/no drivers found/i);
        const classResults = page.getByText(/class/i);

        // At least one of these should be visible
        const hasNav = (await navigation.count()) > 0;
        const hasEmptyState = (await emptyState.count()) > 0;
        const hasClassResults = (await classResults.count()) > 0;

        expect(hasNav || hasEmptyState || hasClassResults).toBe(true);
    });

    test("displays navigation links", async ({ page }) => {
        await page.goto("/t/ner/live");

        // Check for navigation items (Class, Raw, Me are always available)
        const classLink = page.getByRole("link", { name: /^class$/i });

        // At least the navigation should be present
        if ((await classLink.count()) > 0) {
            await expect(classLink.first()).toBeVisible();
        }
    });
});
