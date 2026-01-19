export const HEADERS = {
    TENANT_SLUG: "rr-tenant-slug",

    API: {
        INGEST_API_KEY: "rr-ingest-api-key",
        INGEST_RESULTS_TS: "rr-results-ts",
    },
} as const;

export const ROLES = {
    admin: "admin",
    orgOwner: "org_owner",
    user: "user",
} as const;
