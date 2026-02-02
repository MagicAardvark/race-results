import { NextRequest } from "next/server";

type TenantResult =
    | { type: "TENANT"; tenant: string; basePath: string }
    | { type: "NON_TENANT" }
    | { type: "INVALID_TENANT_FORMAT" };

/**
 * Parses hostname to determine tenant (subdomain) or non-tenant. Single source of truth
 * for host-based tenant detection; used by extractTenant and getTenantRequestMode.
 */
function parseTenantFromHostname(hostname: string): TenantResult {
    const name = hostname.split(":")[0];
    const domainParts = name.split(".");

    // request in the form of [org].localhost (local dev)
    if (name.includes(".localhost")) {
        return {
            type: "TENANT",
            tenant: name.split(".")[0],
            basePath: getTenantBase("subdomain", name.split(".")[0]),
        };
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
    return {
        type: "TENANT",
        tenant: domainParts[0],
        basePath: getTenantBase("subdomain", domainParts[0]),
    };
}

export const extractTenant = (req: NextRequest) => {
    const pathParts = req.nextUrl.pathname.split("/").filter(Boolean);

    // request in the form of t/[org]
    if (pathParts[0] === "t" && pathParts[1]) {
        return {
            type: "TENANT" as const,
            tenant: pathParts[1],
            basePath: getTenantBase("slash", pathParts[1]),
        };
    }

    const host = req.headers.get("host") || "";
    return parseTenantFromHostname(host.split(":")[0]);
};

const getTenantBase = (type: "subdomain" | "slash", orgSlug: string) => {
    if (type === "subdomain") {
        return "/";
    }

    return `/t/${orgSlug}`;
};
