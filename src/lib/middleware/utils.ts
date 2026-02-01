import { NextRequest } from "next/server";

type TenantFromHostname =
    | { type: "TENANT"; tenant: string }
    | { type: "NON_TENANT" }
    | { type: "INVALID_TENANT_FORMAT" };

/**
 * Parses hostname to determine tenant (subdomain) or non-tenant. Single source of truth
 * for host-based tenant detection; used by extractTenant and getTenantRequestMode.
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

    // www subdomain is treated as non-tenant (main site)
    if (domainParts[0].toLowerCase() === "www") {
        return { type: "NON_TENANT" };
    }

    // request in the form of [org].domain.tld
    return { type: "TENANT", tenant: domainParts[0] };
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
