import { NextRequest } from "next/server";

export const extractTenant = (req: NextRequest) => {
    const pathParts = req.nextUrl.pathname.split("/").filter(Boolean);

    // request in the form of t/[org]
    if (pathParts[0] === "t" && pathParts[1]) {
        return {
            type: "TENANT",
            tenant: pathParts[1],
        };
    }

    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0];

    // request in the form of [org].localhost
    if (hostname.includes(".localhost")) {
        return {
            type: "TENANT",
            tenant: hostname.split(".")[0],
        };
    }

    const domainParts = hostname.split(".");

    // multiple subdomains are not supported
    if (domainParts.length > 3) {
        return {
            type: "INVALID_TENANT_FORMAT",
        };
    }

    // no subdomain present
    if (domainParts.length < 3) {
        return {
            type: "NON_TENANT",
        };
    }

    // request in the form of [org].domain.tld
    return {
        type: "TENANT",
        tenant: domainParts[0],
    };
};
