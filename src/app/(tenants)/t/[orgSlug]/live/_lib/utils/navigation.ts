import { FEATURE_FLAGS } from "../config/feature-flags";

/**
 * Navigation configuration for live timing pages
 */
export type NavigationPage = {
    name: string;
    link: string;
    featureFlag?: string;
};

export function getNavigationPages(
    featureFlags?: Record<string, boolean>
): NavigationPage[] {
    const liveBasePath = "/live"; // Base path for live timing pages
    const pages: NavigationPage[] = [
        {
            name: "Class",
            link: liveBasePath,
        },
        {
            name: "PAX",
            link: `${liveBasePath}/pax`,
            featureFlag: FEATURE_FLAGS.PAX_ENABLED,
        },
        {
            name: "Raw",
            link: `${liveBasePath}/raw`,
        },
        {
            name: "Work/Run",
            link: `${liveBasePath}/workrun`,
            featureFlag: FEATURE_FLAGS.WORK_RUN_ENABLED,
        },
        {
            name: "Me",
            link: `${liveBasePath}/me`,
        },
    ];

    // Filter pages based on feature flags
    if (featureFlags) {
        return pages.filter(
            (page) =>
                !page.featureFlag || featureFlags[page.featureFlag] === true
        );
    }

    return pages;
}
