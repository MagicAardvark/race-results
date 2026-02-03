import { joinTenantPath } from "@/app/(tenants)/t/_lib/utils/join-tenant-path";
import { describe, expect, it } from "vitest";

describe("joinTenantPath", () => {
    it("should join tenant base path and relative path correctly", () => {
        const tenantBasePath = "/t/org1";
        const relativePath = "live";
        const result = joinTenantPath(tenantBasePath, relativePath);
        expect(result).toBe("/t/org1/live");
    });

    it("should handle leading slashes in relative path", () => {
        const tenantBasePath = "/t/org1";
        const relativePath = "/live";
        const result = joinTenantPath(tenantBasePath, relativePath);
        expect(result).toBe("/t/org1/live");
    });

    it("should handle trailing slashes in tenant base path", () => {
        const tenantBasePath = "/t/org1/";
        const relativePath = "live";
        const result = joinTenantPath(tenantBasePath, relativePath);
        expect(result).toBe("/t/org1/live");
    });

    it("should handle both leading and trailing slashes", () => {
        const tenantBasePath = "/t/org1/";
        const relativePath = "/live";
        const result = joinTenantPath(tenantBasePath, relativePath);
        expect(result).toBe("/t/org1/live");
    });

    it("should return tenant base path if relative path is empty", () => {
        const tenantBasePath = "/t/org1";
        const relativePath = "";
        const result = joinTenantPath(tenantBasePath, relativePath);
        expect(result).toBe("/t/org1/");
    });

    it("should return '/' if both paths are empty", () => {
        const tenantBasePath = "";
        const relativePath = "";
        const result = joinTenantPath(tenantBasePath, relativePath);
        expect(result).toBe("/");
    });

    it("should handle root tenant base path", () => {
        const tenantBasePath = "/";
        const relativePath = "live";
        const result = joinTenantPath(tenantBasePath, relativePath);
        expect(result).toBe("/live");
    });
});
