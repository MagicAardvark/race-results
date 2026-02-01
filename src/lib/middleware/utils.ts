import { NextRequest } from "next/server";

/** Subdomains that serve the main site (NON_TENANT), not org-specific tenant pages. */
const RESERVED_MAIN_SITE_SUBDOMAINS = ["www", "staging"] as const;

/** Only these base domains support [tenant].domain.tld. Others (e.g. vercel.app) show main site. */
const ALLOWED_TENANT_BASE_DOMAINS = [
    "race-results.org",
    "race-results.live",
] as const;

type TenantFromHostname =
    | { type: "TENANT"; tenant: string }
    | { type: "NON_TENANT" }
    | { type: "INVALID_TENANT_FORMAT" };

/**
 * Parses hostname to determine tenant (subdomain) or non-tenant. Single source of truth
 * for reserved subdomains and allowed base domains.
 */
function parseTenantFromHostname(hostname: string): TenantFromHostname {
    const name = hostname.split(":")[0];
    const domainParts = name.split(".");

    // request in the form of [org].localhost (local dev)
    if (name.includes(".localhost")) {
        return { type: "TENANT", tenant: name.split(".")[0] };
    }

    // multiple subdomains are not supported
    if (domainParts.length > 3) {
        return { type: "INVALID_TENANT_FORMAT" };
    }

    // no subdomain present
    if (domainParts.length < 3) {
        return { type: "NON_TENANT" };
    }

    // subdomain.base.tld: check reserved (www, staging) and base domain allowlist
    const subdomain = domainParts[0];
    const baseDomain = domainParts.slice(1).join(".");

    if (
        RESERVED_MAIN_SITE_SUBDOMAINS.includes(
            subdomain as (typeof RESERVED_MAIN_SITE_SUBDOMAINS)[number]
        )
    ) {
        return { type: "NON_TENANT" };
    }

    if (
        !ALLOWED_TENANT_BASE_DOMAINS.includes(
            baseDomain as (typeof ALLOWED_TENANT_BASE_DOMAINS)[number]
        )
    ) {
        // e.g. xxx.vercel.app or myorg.evil.com → show main site, not tenant
        return { type: "NON_TENANT" };
    }

    // request in the form of [org].race-results.org or [org].race-results.live
    return { type: "TENANT", tenant: subdomain };
}

/**
 * Whether the request is tenant-by-subdomain (e.g. [org].race-results.org) or by path
 * (e.g. race-results.org/t/org/...). Use for building links that keep subdomain URLs clean.
 */
export function getTenantRequestMode(hostname: string): "subdomain" | "path" {
    const result = parseTenantFromHostname(hostname.split(":")[0]);
    return result.type === "TENANT" ? "subdomain" : "path";
}

/**
 * Base path for the live section: "/live" on subdomain, "/t/[orgSlug]/live" on path.
 * Use in server components so links keep subdomain URLs clean (e.g. [org].domain.com/live).
 */
export function getLiveBasePath(host: string, orgSlug: string): string {
    return getTenantRequestMode(host) === "subdomain"
        ? "/live"
        : `/t/${orgSlug}/live`;
}

export const extractTenant = (req: NextRequest) => {
    const pathParts = req.nextUrl.pathname.split("/").filter(Boolean);

    // request in the form of t/[org]
    if (pathParts[0] === "t" && pathParts[1]) {
        return { type: "TENANT" as const, tenant: pathParts[1] };
    }

    const host = req.headers.get("host") || "";
    return parseTenantFromHostname(host.split(":")[0]);
};
