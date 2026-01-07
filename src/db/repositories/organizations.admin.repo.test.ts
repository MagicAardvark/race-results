import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationsAdminRepository } from "./organizations.admin.repo";
import { db, orgs, orgApiKeys } from "@/db";
import { generateApiKey } from "@/lib/auth/generate-api-key";
import { DatabaseError } from "@/lib/errors/app-errors";
import type { OrganizationAdminDTO } from "@/dto/organizations";

// Mock db.query and db operations
vi.mock("@/db", () => ({
    db: {
        query: {
            orgs: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
            },
        },
        insert: vi.fn(),
        update: vi.fn(),
    },
    orgs: {
        slug: "slug",
        orgId: "orgId",
    },
    orgApiKeys: {},
}));

vi.mock("@/lib/auth/generate-api-key", () => ({
    generateApiKey: vi.fn(() => "rr_test123"),
}));

describe("OrganizationsAdminRepository", () => {
    const mockOrg: OrganizationAdminDTO = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: "msr-123",
        description: "Test description",
        isPublic: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        deletedAt: null,
        orgApiKeys: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("findAll", () => {
        it("returns all organizations with API keys", async () => {
            vi.mocked(db.query.orgs.findMany).mockResolvedValue([mockOrg]);

            const result = await organizationsAdminRepository.findAll();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockOrg);
            expect(db.query.orgs.findMany).toHaveBeenCalledWith({
                with: {
                    orgApiKeys: true,
                },
                where: {
                    deletedAt: { isNull: true },
                },
                orderBy: {
                    name: "asc",
                },
            });
        });
    });

    describe("findById", () => {
        it("returns organization when found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(mockOrg);

            const result = await organizationsAdminRepository.findById("org-1");

            expect(result).toEqual(mockOrg);
            expect(db.query.orgs.findFirst).toHaveBeenCalledWith({
                with: {
                    orgApiKeys: true,
                },
                where: {
                    orgId: "org-1",
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns null when organization not found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(undefined);

            const result =
                await organizationsAdminRepository.findById("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("findBySlug", () => {
        it("returns organization when found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(mockOrg);

            const result =
                await organizationsAdminRepository.findBySlug("test-org");

            expect(result).toEqual(mockOrg);
            expect(db.query.orgs.findFirst).toHaveBeenCalledWith({
                with: {
                    orgApiKeys: true,
                },
                where: {
                    slug: "test-org",
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns null when organization not found", async () => {
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(undefined);

            const result =
                await organizationsAdminRepository.findBySlug("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("create", () => {
        it("creates organization successfully", async () => {
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    onConflictDoNothing: vi.fn().mockReturnValue({
                        returning: vi
                            .fn()
                            .mockResolvedValue([{ slug: "test-org" }]),
                    }),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);

            const result = await organizationsAdminRepository.create({
                name: "Test Organization",
                slug: "test-org",
            });

            expect(result).toBe("test-org");
            expect(db.insert).toHaveBeenCalledWith(orgs);
        });

        it("throws DatabaseError when slug already exists", async () => {
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    onConflictDoNothing: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([]),
                    }),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);

            await expect(
                organizationsAdminRepository.create({
                    name: "Test Organization",
                    slug: "existing-slug",
                })
            ).rejects.toThrow(DatabaseError);
        });
    });

    describe("update", () => {
        it("updates organization successfully", async () => {
            const mockUpdate = {
                set: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        returning: vi
                            .fn()
                            .mockResolvedValue([{ slug: "test-org" }]),
                    }),
                }),
            };
            vi.mocked(db.update).mockReturnValue(mockUpdate as never);

            const result = await organizationsAdminRepository.update({
                orgId: "org-1",
                name: "Updated Name",
                description: "Updated description",
                isPublic: false,
            });

            expect(result).toBe("test-org");
            expect(db.update).toHaveBeenCalledWith(orgs);
        });
    });

    describe("delete", () => {
        it("soft deletes organization", async () => {
            const mockUpdate = {
                set: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue(undefined),
                }),
            };
            vi.mocked(db.update).mockReturnValue(mockUpdate as never);

            await organizationsAdminRepository.delete("org-1");

            expect(db.update).toHaveBeenCalledWith(orgs);
        });
    });

    describe("createApiKey", () => {
        it("creates API key and returns organization", async () => {
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    returning: vi
                        .fn()
                        .mockResolvedValue([{ apiKeyId: "key-1" }]),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(mockOrg);

            const result = await organizationsAdminRepository.createApiKey(
                "org-1",
                true
            );

            expect(result).toEqual(mockOrg);
            expect(generateApiKey).toHaveBeenCalled();
            expect(db.insert).toHaveBeenCalledWith(orgApiKeys);
        });

        it("throws DatabaseError when insert fails", async () => {
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue(null),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);

            await expect(
                organizationsAdminRepository.createApiKey("org-1", true)
            ).rejects.toThrow(DatabaseError);
        });

        it("throws DatabaseError when organization not found after creating key", async () => {
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    returning: vi
                        .fn()
                        .mockResolvedValue([{ apiKeyId: "key-1" }]),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);
            vi.mocked(db.query.orgs.findFirst).mockResolvedValue(undefined);

            await expect(
                organizationsAdminRepository.createApiKey("org-1", true)
            ).rejects.toThrow(DatabaseError);
        });
    });
});
