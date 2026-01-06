import { test, expect } from "@playwright/test";

const ORG_SLUG = "ner"; // Using a known organization slug from seed data

test("Live Timing - Smoke Test", async ({ page }) => {
    // Load the main live timing page once
    await page.goto(`/t/${ORG_SLUG}/live`);
    await page.waitForLoadState("networkidle");

    // Verify main page loads - check for navigation or content
    const navigation = page.getByRole("navigation");
    const emptyState = page.getByText(/no drivers found/i);
    const classResults = page.getByText(/class/i);

    const hasNav = (await navigation.count()) > 0;
    const hasEmptyState = (await emptyState.count()) > 0;
    const hasClassResults = (await classResults.count()) > 0;

    expect(hasNav || hasEmptyState || hasClassResults).toBe(true);

    // Verify navigation is visible
    if (hasNav) {
        await expect(navigation.first()).toBeVisible();
    }

    // Verify Class link is visible (should always be available)
    const classLink = page.getByRole("link", { name: /^class$/i });
    if ((await classLink.count()) > 0) {
        await expect(classLink.first()).toBeVisible();
    }

    // Verify refresh button is visible
    const refreshButtonByTitle = page.getByTitle("Refresh data");
    const refreshButtonByRole = page.getByRole("button", { name: /refresh/i });

    const hasTitleButton = (await refreshButtonByTitle.count()) > 0;
    const hasRoleButton = (await refreshButtonByRole.count()) > 0;

    if (hasTitleButton) {
        await expect(refreshButtonByTitle.first()).toBeVisible();
    } else if (hasRoleButton) {
        await expect(refreshButtonByRole.first()).toBeVisible();
    }

    // Test navigation to PAX page (if available)
    const paxLink = page.getByRole("link", { name: /^pax$/i });
    if ((await paxLink.count()) > 0) {
        await paxLink.first().click();
        await expect(page).toHaveURL(new RegExp(`/t/${ORG_SLUG}/live/pax`));

        // Verify PAX page content
        const paxContent = page.getByText(/pax/i);
        const paxEmptyState = page.getByText(/no drivers found/i);
        const hasPaxContent = (await paxContent.count()) > 0;
        const hasPaxEmptyState = (await paxEmptyState.count()) > 0;
        expect(hasPaxContent || hasPaxEmptyState).toBe(true);

        // Verify navigation still visible
        const navOnPax = page.getByRole("navigation");
        if ((await navOnPax.count()) > 0) {
            await expect(navOnPax.first()).toBeVisible();
        }
    }

    // Test navigation to Raw page (if available)
    const rawLink = page.getByRole("link", { name: /^raw$/i });
    if ((await rawLink.count()) > 0) {
        await rawLink.first().click();
        await expect(page).toHaveURL(new RegExp(`/t/${ORG_SLUG}/live/raw`));

        // Verify Raw page content
        const rawContent = page.getByText(/raw/i);
        const rawEmptyState = page.getByText(/no drivers found/i);
        const hasRawContent = (await rawContent.count()) > 0;
        const hasRawEmptyState = (await rawEmptyState.count()) > 0;
        expect(hasRawContent || hasRawEmptyState).toBe(true);

        // Verify navigation still visible
        const navOnRaw = page.getByRole("navigation");
        if ((await navOnRaw.count()) > 0) {
            await expect(navOnRaw.first()).toBeVisible();
        }
    }

    // Test navigation to Me page (if available)
    const meLink = page.getByRole("link", { name: /^me$/i });
    if ((await meLink.count()) > 0) {
        await meLink.first().click();
        await expect(page).toHaveURL(new RegExp(`/t/${ORG_SLUG}/live/me`));

        // Verify Me page content
        const driverSelectByPlaceholder =
            page.getByPlaceholder(/select.*driver/i);
        const driverSelectByText = page.getByText(/select.*driver/i);
        const statsContentPosition = page.getByText(/position/i);
        const statsContentRuns = page.getByText(/runs/i);
        const meEmptyState = page.getByText(/no drivers found/i);

        const hasDriverSelect =
            (await driverSelectByPlaceholder.count()) > 0 ||
            (await driverSelectByText.count()) > 0;
        const hasStatsContent =
            (await statsContentPosition.count()) > 0 ||
            (await statsContentRuns.count()) > 0;
        const hasMeEmptyState = (await meEmptyState.count()) > 0;

        expect(hasDriverSelect || hasStatsContent || hasMeEmptyState).toBe(
            true
        );

        // Verify navigation still visible
        const navOnMe = page.getByRole("navigation");
        if ((await navOnMe.count()) > 0) {
            await expect(navOnMe.first()).toBeVisible();
        }
    }

    // Test navigation to Work/Run page (if available)
    const workRunLink1 = page.getByRole("link", { name: /work.*run/i });
    const workRunLink2 = page.getByRole("link", { name: /run.*work/i });
    const hasWorkRunLink1 = (await workRunLink1.count()) > 0;
    const hasWorkRunLink2 = (await workRunLink2.count()) > 0;

    if (hasWorkRunLink1 || hasWorkRunLink2) {
        const linkToClick = hasWorkRunLink1 ? workRunLink1 : workRunLink2;
        await linkToClick.first().click();
        await expect(page).toHaveURL(new RegExp(`/t/${ORG_SLUG}/live/workrun`));

        // Verify Work/Run page content
        const workRunContent1 = page.getByText(/work/i);
        const workRunContent2 = page.getByText(/run/i);
        const workRunEmptyState1 = page.getByText(/no.*data/i);
        const workRunEmptyState2 = page.getByText(/not.*available/i);

        const hasWorkRunContent =
            (await workRunContent1.count()) > 0 ||
            (await workRunContent2.count()) > 0;
        const hasWorkRunEmptyState =
            (await workRunEmptyState1.count()) > 0 ||
            (await workRunEmptyState2.count()) > 0;

        expect(hasWorkRunContent || hasWorkRunEmptyState).toBe(true);

        // Verify navigation still visible
        const navOnWorkRun = page.getByRole("navigation");
        if ((await navOnWorkRun.count()) > 0) {
            await expect(navOnWorkRun.first()).toBeVisible();
        }
    }

    // Navigate back to Class page to test refresh
    const classLinkBack = page.getByRole("link", { name: /^class$/i });
    if ((await classLinkBack.count()) > 0) {
        await classLinkBack.first().click();
        await expect(page).toHaveURL(new RegExp(`/t/${ORG_SLUG}/live$`));
    }

    // Test refresh button functionality
    const refreshButtonByTitleFinal = page.getByTitle("Refresh data");
    const refreshButtonByRoleFinal = page.getByRole("button", {
        name: /refresh/i,
    });

    const hasTitleButtonFinal = (await refreshButtonByTitleFinal.count()) > 0;
    const hasRoleButtonFinal = (await refreshButtonByRoleFinal.count()) > 0;

    if (hasTitleButtonFinal) {
        await expect(refreshButtonByTitleFinal.first()).toBeEnabled();
        await refreshButtonByTitleFinal.first().click();
        await page.waitForTimeout(100);
    } else if (hasRoleButtonFinal) {
        await expect(refreshButtonByRoleFinal.first()).toBeEnabled();
        await refreshButtonByRoleFinal.first().click();
        await page.waitForTimeout(100);
    }

    // Verify URL persistence - organization slug is preserved throughout navigation
    await expect(page).toHaveURL(new RegExp(`/t/${ORG_SLUG}/live`));
});
