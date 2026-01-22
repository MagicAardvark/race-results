export const HEADERS = {
    TENANT_SLUG: "rr-tenant-slug",

    API: {
        INGEST_API_KEY: "rr-ingest-api-key",
        INGEST_RESULTS_TS: "rr-results-ts",
    },
} as const;

export const ROLES = {
    admin: "admin",
    orgManager: "org_manager",
    orgOwner: "org_owner",
    user: "user",
} as const;
