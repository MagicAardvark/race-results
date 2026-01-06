import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationsRepository } from "./organizations.repo";
import { db } from "@/db";
import type { OrganizationDTO } from "@/dto/organizations";

// Mock db.query
vi.mock("@/db", () => ({
    db: {
        query: {
            orgs: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
            },
        },
    },
}));

describe("OrganizationsRepository", () => {
    const mockOrg: OrganizationDTO = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: "msr-123",
        description: "Test description",
        isPublic: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        deletedAt: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("findAll", () => {
        it("returns all public organizations by default", async () => {
            vi.mocked(db.query.orgs.findMany).mockResolvedValue([mockOrg]);

            const result = await organizationsRepository.findAll();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockOrg);
            expect(db.query.orgs.findMany).toHaveBeenCalledWith({
                where: {
                    deletedAt: { isNull: true },
                    isPublic: { eq: true },
                },
                orderBy: {
                    name: "asc",
                },
            });
        });

        it("returns all organizations when publicOnly is false", async () => {
            vi.mocked(db.query.orgs.findMany).mockResolvedValue([mockOrg]);

            const result = await organizationsRepository.findAll(false);

            expect(result).toHaveLength(1);
            expect(db.query.orgs.findMany).toHaveBeenCalledWith({
                where: {
                    deletedAt: { isNull: true },
                    isPublic: undefined,
                },
                orderBy: {
                    name: "asc",
                },
            });
        });

        it("returns empty array when no organizations found", async () => {
            vi.mocked(db.query.orgs.findMany).mockResolvedValue([]);

            const result = await organizationsRepository.findAll();

            expect(result).toEqual([]);
        });
    });

    describe("findById", () => {
        it("returns organization when found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(mockOrg);

            const result = await organizationsRepository.findById("org-1");

            expect(result).toEqual(mockOrg);
            expect(db.query.orgs.findFirst).toHaveBeenCalledWith({
                where: {
                    orgId: "org-1",
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns null when organization not found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(undefined);

            const result =
                await organizationsRepository.findById("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("findBySlug", () => {
        it("returns organization when found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(mockOrg);

            const result = await organizationsRepository.findBySlug("test-org");

            expect(result).toEqual(mockOrg);
            expect(db.query.orgs.findFirst).toHaveBeenCalledWith({
                where: {
                    slug: "test-org",
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns null when organization not found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(undefined);

            const result =
                await organizationsRepository.findBySlug("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("findByName", () => {
        it("returns organization when found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(mockOrg);

            const result =
                await organizationsRepository.findByName("Test Organization");

            expect(result).toEqual(mockOrg);
            expect(db.query.orgs.findFirst).toHaveBeenCalledWith({
                where: {
                    name: "Test Organization",
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns null when organization not found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(undefined);

            const result =
                await organizationsRepository.findByName("Non-existent");

            expect(result).toBeNull();
        });
    });
});
