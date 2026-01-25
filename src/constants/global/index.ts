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

export const CLASSING = {
    DEFAULT_INDEX_VALUE: 1,
};
