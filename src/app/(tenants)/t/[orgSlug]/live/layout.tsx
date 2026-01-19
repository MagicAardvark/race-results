import { LiveResultsProvider } from "./_lib/context/live-results-context";
import {
    getClassResults,
    getPaxResults,
    getRawResults,
    getRunWork,
} from "./_lib/data/results";
import { DisplayMode } from "./_lib/types";
import { requireValidTenant } from "./_lib/utils/tenant-guard";
import { LiveLayoutClient } from "./_lib/components/live-layout-client";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";

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
        getClassResults(orgSlug),
        getPaxResults(orgSlug),
        getRawResults(orgSlug),
        getRunWork(orgSlug),
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
