import { LiveResultsProvider } from "./_lib/context/live-results-context";
import { DisplayMode } from "./_lib/types";
import { LiveLayoutClient } from "./_lib/components/live-layout-client";
import { getNavigationPages } from "./_lib/utils/navigation";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { liveResultsService } from "@/services/live-results/live-results.service";
import { getTenantBasePath } from "@/app/(tenants)/t/_lib/utils/get-tenant-base-path";
import { tenantService } from "@/services/tenants/tenant.service";

/**
 * Live layout: all data is fetched on the server (SSR). No client-side
 * fetching for initial load. Results are passed into context; refresh uses
 * router.refresh() to re-run this layout on the server.
 */
export default async function LiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const org = await tenantService.getTenant();
    const basePath = await getTenantBasePath();

    // Fetch all data on the server in parallel
    // TODO: Get display mode from event/tenant configuration
    const displayMode = DisplayMode.autocross;
    const results = await Promise.all([
        liveResultsService.getClassResults(org.slug),
        liveResultsService.getIndexedResults(org.slug),
        liveResultsService.getRawResults(org.slug),
        Promise.resolve(null), // TODO: Add getRunWork to service when available
        featureFlagsService.getOrgFeatureFlags(org.orgId),
    ]);

    const [classResults, paxResults, rawResults, runWork, featureFlags] =
        results;

    // Compute nav on server so client doesn't depend on context for it
    const navigationPages = getNavigationPages(featureFlags ?? undefined);

    return (
        <LiveResultsProvider
            classResults={classResults}
            paxResults={paxResults}
            rawResults={rawResults}
            runWork={runWork}
            displayMode={displayMode}
            featureFlags={featureFlags}
            basePath={basePath}
        >
            <LiveLayoutClient
                basePath={basePath}
                navigationPages={navigationPages}
            >
                {children}
            </LiveLayoutClient>
        </LiveResultsProvider>
    );
}
