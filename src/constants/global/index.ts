/** Main site URL for "Back to Organizations" etc. Use env in prod if you have multiple domains. */
export const MAIN_SITE_URL =
    process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://www.race-results.org";

export const HEADERS = {
    TENANT: {
        SLUG: "rr-tenant-slug",
        BASE_PATH: "rr-tenant-base-url",
    },
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
