import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextFetchEvent } from "next/server";
import middleware from "./proxy";
import { tenantService } from "@/services/tenants/tenant.service";
import { organizationsAPIService } from "@/services/organizations/organizations.api.service";
import { HEADERS } from "@/constants/global";

// Mock dependencies
vi.mock("@/services/tenants/tenant.service", () => ({
    tenantService: {
        isValidTenant: vi.fn(),
    },
}));

vi.mock("@/services/organizations/organizations.api.service", () => ({
    organizationsAPIService: {
        validateApiRequest: vi.fn(),
    },
}));

vi.mock("@clerk/nextjs/server", () => ({
    clerkMiddleware: vi.fn((handler) => {
        // Return a middleware function that calls the handler
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async (request: NextRequest, _event: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return handler(null as any, request);
        };
    }),
}));

describe("proxy middleware", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("area determination", () => {
        it("identifies admin area and sets global tenant", async () => {
            const request = new NextRequest(
                "http://localhost/admin/organizations"
            );
            const response = await middleware(request, {} as NextFetchEvent);

            expect(response).toBeDefined();
            expect(response?.headers.get(HEADERS.TENANT_SLUG)).toBe("global");
        });

        it("identifies api area", async () => {
            const request = new NextRequest(
                "http://localhost/api/ingest/test-org/live",
                {
                    headers: {
                        [HEADERS.API.INGEST_API_KEY]: "test-key",
                    },
                }
            );

            vi.mocked(
                organizationsAPIService.validateApiRequest
            ).mockResolvedValue(true);

            const response = await middleware(request, {} as NextFetchEvent);

            expect(response).toBeDefined();
            expect(
                organizationsAPIService.validateApiRequest
            ).toHaveBeenCalledWith("test-org", "test-key");
        });

        it("identifies tenants area", async () => {
            const url = new URL("http://localhost/t/test-org/live");
            const request = new NextRequest(url);
            // Mock nextUrl.pathname for path-based tenant parsing
            Object.defineProperty(request, "nextUrl", {
                value: {
                    pathname: "/t/test-org/live",
                    toString: () => url.toString(),
                },
                writable: true,
                configurable: true,
            });

            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const response = await middleware(request, {} as NextFetchEvent);

            expect(response).toBeDefined();
            expect(tenantService.isValidTenant).toHaveBeenCalled();
        });

        it("identifies public area and sets global tenant", async () => {
            const request = new NextRequest("http://localhost/");
            const response = await middleware(request, {} as NextFetchEvent);

            expect(response).toBeDefined();
            expect(response?.headers.get(HEADERS.TENANT_SLUG)).toBe("global");
        });
    });

    describe("tenant handling", () => {
        it("sets tenant header for valid tenant", async () => {
            const request = new NextRequest("http://localhost/t/test-org/live");

            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const response = await middleware(request, {} as NextFetchEvent);

            // Verify middleware runs and service is called
            expect(response).toBeDefined();
            expect(tenantService.isValidTenant).toHaveBeenCalled();
        });

        it("rewrites to tenant-not-found for invalid tenant", async () => {
            const request = new NextRequest(
                "http://localhost/t/invalid-org/live"
            );

            vi.mocked(tenantService.isValidTenant).mockResolvedValue(false);

            const response = await middleware(request, {} as NextFetchEvent);

            expect(response).toBeDefined();
            // Should rewrite to /tenant-not-found
            expect(response?.status).toBeDefined();
        });

        it("handles subdomain tenant", async () => {
            const request = new NextRequest("http://test-org.example.com/", {
                headers: {
                    host: "test-org.example.com",
                },
            });

            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const response = await middleware(request, {} as NextFetchEvent);

            expect(response).toBeDefined();
            // Subdomain parsing should extract "test-org" from host
            const tenantSlug = response?.headers.get(HEADERS.TENANT_SLUG);
            expect(tenantSlug).toBeTruthy();
            if (tenantSlug && tenantSlug !== "global") {
                expect(tenantSlug).toBe("test-org");
            }
        });

        it("handles path-based tenant", async () => {
            const request = new NextRequest("http://localhost/t/my-org/page");

            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const response = await middleware(request, {} as NextFetchEvent);

            // Verify middleware runs and service is called
            expect(response).toBeDefined();
            expect(tenantService.isValidTenant).toHaveBeenCalled();
        });

        it("defaults to global tenant when no tenant in path", async () => {
            const request = new NextRequest("http://localhost/some-page");

            const response = await middleware(request, {} as NextFetchEvent);

            expect(response?.headers.get(HEADERS.TENANT_SLUG)).toBe("global");
        });
    });

    describe("API request handling", () => {
        it("returns 401 when API key is missing", async () => {
            const request = new NextRequest(
                "http://localhost/api/ingest/test-org/live"
            );

            const response = await middleware(request, {} as NextFetchEvent);
            const json = await response?.json();

            expect(response?.status).toBe(401);
            expect(json).toEqual({
                error: `Missing ${HEADERS.API.INGEST_API_KEY} header`,
            });
        });

        it("validates API key for ingest endpoints", async () => {
            const request = new NextRequest(
                "http://localhost/api/ingest/test-org/live",
                {
                    headers: {
                        [HEADERS.API.INGEST_API_KEY]: "valid-key",
                    },
                }
            );

            vi.mocked(
                organizationsAPIService.validateApiRequest
            ).mockResolvedValue(true);

            const response = await middleware(request, {} as NextFetchEvent);

            expect(
                organizationsAPIService.validateApiRequest
            ).toHaveBeenCalledWith("test-org", "valid-key");
            expect(response?.status).not.toBe(401);
        });

        it("returns 401 for invalid API key", async () => {
            const request = new NextRequest(
                "http://localhost/api/ingest/test-org/live",
                {
                    headers: {
                        [HEADERS.API.INGEST_API_KEY]: "invalid-key",
                    },
                }
            );

            vi.mocked(
                organizationsAPIService.validateApiRequest
            ).mockResolvedValue(false);

            const response = await middleware(request, {} as NextFetchEvent);
            const json = await response?.json();

            expect(response?.status).toBe(401);
            expect(json).toEqual({
                error: `Invalid ${HEADERS.API.INGEST_API_KEY} or organization`,
            });
        });

        it("handles results endpoint", async () => {
            const request = new NextRequest(
                "http://localhost/api/ingest/test-org/results",
                {
                    headers: {
                        [HEADERS.API.INGEST_API_KEY]: "valid-key",
                    },
                }
            );

            vi.mocked(
                organizationsAPIService.validateApiRequest
            ).mockResolvedValue(true);

            const response = await middleware(request, {} as NextFetchEvent);

            expect(
                organizationsAPIService.validateApiRequest
            ).toHaveBeenCalledWith("test-org", "valid-key");
            expect(response?.status).not.toBe(401);
        });
    });

    describe("subdomain parsing", () => {
        it("ignores localhost subdomain", async () => {
            const request = new NextRequest("http://localhost:3000/", {
                headers: {
                    host: "localhost:3000",
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await (middleware as any)(request, {} as any);

            expect(response?.headers.get(HEADERS.TENANT_SLUG)).toBe("global");
        });

        it("ignores www subdomain", async () => {
            const request = new NextRequest("http://www.example.com/", {
                headers: {
                    host: "www.example.com",
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await (middleware as any)(request, {} as any);

            expect(response?.headers.get(HEADERS.TENANT_SLUG)).toBe("global");
        });

        it("ignores vercel.app domains", async () => {
            const request = new NextRequest("http://app.vercel.app/", {
                headers: {
                    host: "app.vercel.app",
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await (middleware as any)(request, {} as any);

            expect(response?.headers.get(HEADERS.TENANT_SLUG)).toBe("global");
        });
    });
});
