import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { TenantProvider } from "@/context/TenantContext";
import { LiveResultsProvider } from "@/app/(tenants)/t/[orgSlug]/live/_lib/context/live-results-context";
import type { Tenant } from "@/dto/tenants";
import type {
    ProcessedLiveClassResults,
    ProcessedLiveIndexResults,
    ProcessedLiveRawResults,
    RunWork,
} from "@/app/(tenants)/t/[orgSlug]/live/_lib/types";
import { DisplayMode } from "@/app/(tenants)/t/[orgSlug]/live/_lib/types";

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
    tenant?: Tenant;
    liveData?: {
        classResults?: ProcessedLiveClassResults | null;
        paxResults?: ProcessedLiveIndexResults | null;
        rawResults?: ProcessedLiveRawResults | null;
        runWork?: RunWork | null;
        displayMode?: DisplayMode;
        featureFlags?: Record<string, boolean>;
    };
};

const defaultTenant: Tenant = {
    isValid: true,
    isGlobal: false,
    org: {
        orgId: "test-org-id",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: null,
        description: null,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
};

const defaultLiveData = {
    classResults: null as ProcessedLiveClassResults | null,
    paxResults: null as ProcessedLiveIndexResults | null,
    rawResults: null as ProcessedLiveRawResults | null,
    runWork: null as RunWork | null,
    displayMode: DisplayMode.autocross,
    featureFlags: {},
};

export function renderWithProviders(
    ui: ReactElement,
    {
        tenant = defaultTenant,
        liveData,
        ...renderOptions
    }: CustomRenderOptions = {}
) {
    // Merge with defaults, but allow explicit null/undefined to pass through
    const mergedLiveData = {
        classResults:
            liveData?.classResults !== undefined
                ? liveData.classResults
                : defaultLiveData.classResults,
        paxResults:
            liveData?.paxResults !== undefined
                ? liveData.paxResults
                : defaultLiveData.paxResults,
        rawResults:
            liveData?.rawResults !== undefined
                ? liveData.rawResults
                : defaultLiveData.rawResults,
        runWork:
            liveData?.runWork !== undefined
                ? liveData.runWork
                : defaultLiveData.runWork,
        displayMode: liveData?.displayMode ?? defaultLiveData.displayMode,
        featureFlags: liveData?.featureFlags ?? defaultLiveData.featureFlags,
    };

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <TenantProvider tenant={tenant}>
                <LiveResultsProvider
                    classResults={mergedLiveData.classResults ?? null}
                    paxResults={mergedLiveData.paxResults ?? null}
                    rawResults={mergedLiveData.rawResults ?? null}
                    runWork={mergedLiveData.runWork ?? null}
                    displayMode={mergedLiveData.displayMode}
                    featureFlags={mergedLiveData.featureFlags}
                >
                    {children}
                </LiveResultsProvider>
            </TenantProvider>
        );
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
