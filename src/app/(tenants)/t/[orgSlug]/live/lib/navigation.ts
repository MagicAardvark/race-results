import { FEATURE_FLAGS } from "./feature-flags";

/**
 * Navigation configuration for live timing pages
 */
export type NavigationPage = {
    name: string;
    link: string;
    featureFlag?: string;
};

export function getNavigationPages(
    basePath: string,
    featureFlags?: Record<string, boolean>
): NavigationPage[] {
    const pages: NavigationPage[] = [
        {
            name: "Class",
            link: basePath,
        },
        {
            name: "PAX",
            link: `${basePath}/pax`,
            featureFlag: FEATURE_FLAGS.PAX_ENABLED,
        },
        {
            name: "Raw",
            link: `${basePath}/raw`,
        },
        {
            name: "Work/Run",
            link: `${basePath}/workrun`,
            featureFlag: FEATURE_FLAGS.WORK_RUN_ENABLED,
        },
        {
            name: "Me",
            link: `${basePath}/me`,
        },
    ];

    // Filter pages based on feature flags
    if (featureFlags) {
        return pages.filter(
            (page) => !page.featureFlag || featureFlags[page.featureFlag] === true
        );
    }

    return pages;
}
