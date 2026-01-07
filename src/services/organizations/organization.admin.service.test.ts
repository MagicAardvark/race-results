import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationAdminService } from "./organization.admin.service";
import { organizationsAdminRepository } from "@/db/repositories/organizations.admin.repo";
import { organizationsRepository } from "@/db/repositories/organizations.repo";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import type {
    OrganizationAdminDTO,
    OrganizationExtended,
} from "@/dto/organizations";
import { ValidationError } from "@/lib/errors/app-errors";

// Mock repositories
vi.mock("@/db/repositories/organizations.admin.repo", () => ({
    organizationsAdminRepository: {
        findAll: vi.fn(),
        findBySlug: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        createApiKey: vi.fn(),
    },
}));

vi.mock("@/db/repositories/organizations.repo", () => ({
    organizationsRepository: {
        findByName: vi.fn(),
    },
}));

vi.mock("@/services/feature-flags/feature-flags.service", () => ({
    featureFlagsService: {
        updateOrgFeatureFlags: vi.fn(),
    },
}));

describe("OrganizationAdminService", () => {
    const mockOrgAdminDTO: OrganizationAdminDTO = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: "msr-123",
        description: "Test description",
        isPublic: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        deletedAt: null,
        orgApiKeys: [
            {
                orgId: "org-1",
                apiKeyId: "key-1",
                apiKey: "rr_test123",
                apiKeyEnabled: true,
                effectiveAt: new Date("2024-01-02"),
            },
            {
                orgId: "org-1",
                apiKeyId: "key-2",
                apiKey: "rr_test456",
                apiKeyEnabled: false,
                effectiveAt: new Date("2024-01-01"),
            },
        ],
    };

    const mockOrgExtended: OrganizationExtended = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: "msr-123",
        description: "Test description",
        isPublic: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        deletedAt: null,
        orgApiKeys: [
            {
                apiKeyId: "key-1",
                apiKey: "rr_test123",
                apiKeyEnabled: true,
                effectiveAt: new Date("2024-01-02"),
            },
            {
                apiKeyId: "key-2",
                apiKey: "rr_test456",
                apiKeyEnabled: false,
                effectiveAt: new Date("2024-01-01"),
            },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getAll", () => {
        it("returns all organizations mapped to extended format", async () => {
            vi.mocked(organizationsAdminRepository.findAll).mockResolvedValue([
                mockOrgAdminDTO,
            ]);

            const result = await organizationAdminService.getAll();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockOrgExtended);
            expect(result[0].orgApiKeys[0].apiKeyId).toBe("key-1"); // Sorted by effectiveAt desc
        });

        it("sorts API keys by effectiveAt descending", async () => {
            const orgWithKeys = {
                ...mockOrgAdminDTO,
                orgApiKeys: [
                    {
                        orgId: "org-1",
                        apiKeyId: "key-old",
                        apiKey: "rr_old",
                        apiKeyEnabled: true,
                        effectiveAt: new Date("2024-01-01"),
                    },
                    {
                        orgId: "org-1",
                        apiKeyId: "key-new",
                        apiKey: "rr_new",
                        apiKeyEnabled: true,
                        effectiveAt: new Date("2024-01-02"),
                    },
                ],
            };
            vi.mocked(organizationsAdminRepository.findAll).mockResolvedValue([
                orgWithKeys,
            ]);

            const result = await organizationAdminService.getAll();

            expect(result[0].orgApiKeys[0].apiKeyId).toBe("key-new");
            expect(result[0].orgApiKeys[1].apiKeyId).toBe("key-old");
        });
    });

    describe("findBySlug", () => {
        it("returns organization when found", async () => {
            vi.mocked(
                organizationsAdminRepository.findBySlug
            ).mockResolvedValue(mockOrgAdminDTO);

            const result =
                await organizationAdminService.findBySlug("test-org");

            expect(result).toEqual(mockOrgExtended);
        });

        it("returns null when organization not found", async () => {
            vi.mocked(
                organizationsAdminRepository.findBySlug
            ).mockResolvedValue(null);

            const result =
                await organizationAdminService.findBySlug("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("createOrganization", () => {
        it("creates organization with generated slug", async () => {
            vi.mocked(
                organizationsAdminRepository.findBySlug
            ).mockResolvedValue(null);
            vi.mocked(organizationsRepository.findByName).mockResolvedValue(
                null
            );
            vi.mocked(organizationsAdminRepository.create).mockResolvedValue(
                "test-organization"
            );

            const result = await organizationAdminService.createOrganization({
                name: "Test Organization",
            });

            expect(result).toBe("test-organization");
            expect(organizationsAdminRepository.create).toHaveBeenCalledWith({
                name: "Test Organization",
                slug: "test-organization",
            });
        });

        it("generates slug from name", async () => {
            vi.mocked(
                organizationsAdminRepository.findBySlug
            ).mockResolvedValue(null);
            vi.mocked(organizationsRepository.findByName).mockResolvedValue(
                null
            );
            vi.mocked(organizationsAdminRepository.create).mockResolvedValue(
                "my-org-name"
            );

            await organizationAdminService.createOrganization({
                name: "My Org Name!",
            });

            expect(organizationsAdminRepository.create).toHaveBeenCalledWith({
                name: "My Org Name!",
                slug: "my-org-name",
            });
        });

        it("throws ValidationError when slug already exists", async () => {
            vi.mocked(
                organizationsAdminRepository.findBySlug
            ).mockResolvedValue(mockOrgAdminDTO);

            await expect(
                organizationAdminService.createOrganization({
                    name: "Test Organization",
                })
            ).rejects.toThrow(ValidationError);
        });

        it("throws ValidationError when name already exists", async () => {
            vi.mocked(
                organizationsAdminRepository.findBySlug
            ).mockResolvedValue(null);
            vi.mocked(organizationsRepository.findByName).mockResolvedValue({
                orgId: "other-org",
                name: "Test Organization",
            } as never);

            await expect(
                organizationAdminService.createOrganization({
                    name: "Test Organization",
                })
            ).rejects.toThrow(ValidationError);
        });
    });

    describe("updateOrganization", () => {
        it("updates organization successfully", async () => {
            vi.mocked(organizationsRepository.findByName).mockResolvedValue(
                null
            );
            vi.mocked(organizationsAdminRepository.update).mockResolvedValue(
                "test-org"
            );

            const result = await organizationAdminService.updateOrganization({
                orgId: "org-1",
                name: "Updated Name",
                description: null,
                isPublic: true,
            });

            expect(result).toBe("test-org");
            expect(organizationsAdminRepository.update).toHaveBeenCalledWith({
                orgId: "org-1",
                name: "Updated Name",
                description: null,
                isPublic: true,
            });
        });

        it("updates feature flags when provided", async () => {
            vi.mocked(organizationsRepository.findByName).mockResolvedValue(
                null
            );
            vi.mocked(organizationsAdminRepository.update).mockResolvedValue(
                "test-org"
            );

            await organizationAdminService.updateOrganization({
                orgId: "org-1",
                name: "Updated Name",
                description: null,
                isPublic: true,
                featureFlags: { feature1: true },
            });

            expect(
                featureFlagsService.updateOrgFeatureFlags
            ).toHaveBeenCalledWith("org-1", { feature1: true });
        });

        it("does not update feature flags when not provided", async () => {
            vi.mocked(organizationsRepository.findByName).mockResolvedValue(
                null
            );
            vi.mocked(organizationsAdminRepository.update).mockResolvedValue(
                "test-org"
            );

            await organizationAdminService.updateOrganization({
                orgId: "org-1",
                name: "Updated Name",
                description: null,
                isPublic: true,
            });

            expect(
                featureFlagsService.updateOrgFeatureFlags
            ).not.toHaveBeenCalled();
        });

        it("throws ValidationError when name conflicts with another org", async () => {
            vi.mocked(organizationsRepository.findByName).mockResolvedValue({
                orgId: "other-org",
                name: "Updated Name",
            } as never);

            await expect(
                organizationAdminService.updateOrganization({
                    orgId: "org-1",
                    name: "Updated Name",
                    description: null,
                    isPublic: true,
                })
            ).rejects.toThrow(ValidationError);
        });

        it("allows same name for same org", async () => {
            vi.mocked(organizationsRepository.findByName).mockResolvedValue({
                orgId: "org-1",
                name: "Updated Name",
            } as never);
            vi.mocked(organizationsAdminRepository.update).mockResolvedValue(
                "test-org"
            );

            const result = await organizationAdminService.updateOrganization({
                orgId: "org-1",
                name: "Updated Name",
                description: null,
                isPublic: true,
            });

            expect(result).toBe("test-org");
        });
    });

    describe("deleteOrganization", () => {
        it("deletes organization", async () => {
            await organizationAdminService.deleteOrganization("org-1");

            expect(organizationsAdminRepository.delete).toHaveBeenCalledWith(
                "org-1"
            );
        });
    });

    describe("createApiKey", () => {
        it("creates API key and returns organization", async () => {
            vi.mocked(
                organizationsAdminRepository.createApiKey
            ).mockResolvedValue(mockOrgAdminDTO);

            const result = await organizationAdminService.createApiKey(
                "org-1",
                true
            );

            expect(result).toEqual(mockOrgExtended);
            expect(
                organizationsAdminRepository.createApiKey
            ).toHaveBeenCalledWith("org-1", true);
        });
    });
});
