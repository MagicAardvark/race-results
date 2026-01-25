import { LiveResultsProvider } from "./_lib/context/live-results-context";
import { DisplayMode } from "./_lib/types";
import { requireValidTenant } from "./_lib/utils/tenant-guard";
import { LiveLayoutClient } from "./_lib/components/live-layout-client";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { liveResultsService } from "@/services/live-results/live-results.service";

export default async function LiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const tenant = await requireValidTenant();
    const orgSlug = tenant.org?.slug || "";

    // Fetch all data on the server in parallel
    // TODO: Get display mode from event/tenant configuration
    const displayMode = DisplayMode.autocross;
    const results = await Promise.all([
        liveResultsService.getClassResults(orgSlug),
        liveResultsService.getIndexedResults(orgSlug),
        liveResultsService.getRawResults(orgSlug),
        Promise.resolve(null), // TODO: Add getRunWork to service when available
        tenant.isValid && !tenant.isGlobal && tenant.org
            ? featureFlagsService.getOrgFeatureFlags(tenant.org.orgId)
            : Promise.resolve({}),
    ]);

    const [classResults, paxResults, rawResults, runWork, featureFlags] =
        results;

    return (
        <LiveResultsProvider
            classResults={classResults}
            paxResults={paxResults}
            rawResults={rawResults}
            runWork={runWork}
            displayMode={displayMode}
            featureFlags={featureFlags}
        >
            <LiveLayoutClient>{children}</LiveLayoutClient>
        </LiveResultsProvider>
    );
}
