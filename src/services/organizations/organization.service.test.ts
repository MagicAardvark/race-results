import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationService } from "./organization.service";
import { organizationsRepository } from "@/db/repositories/organizations.repo";
import type { OrganizationDTO } from "@/dto/organizations";

// Mock the repository
vi.mock("@/db/repositories/organizations.repo", () => ({
    organizationsRepository: {
        findAll: vi.fn(),
        findBySlug: vi.fn(),
    },
}));

describe("OrganizationService", () => {
    const mockOrgDTO: OrganizationDTO = {
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

    describe("getAllOrganizations", () => {
        it("returns all organizations when publicOnly is false", async () => {
            vi.mocked(organizationsRepository.findAll).mockResolvedValue([
                mockOrgDTO,
            ]);

            const result = await organizationService.getAllOrganizations(false);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                orgId: "org-1",
                name: "Test Organization",
                slug: "test-org",
                motorsportregOrgId: "msr-123",
                description: "Test description",
                isPublic: true,
                createdAt: mockOrgDTO.createdAt,
                updatedAt: mockOrgDTO.updatedAt,
                deletedAt: null,
            });
            expect(organizationsRepository.findAll).toHaveBeenCalledWith(false);
        });

        it("returns public organizations by default", async () => {
            vi.mocked(organizationsRepository.findAll).mockResolvedValue([
                mockOrgDTO,
            ]);

            await organizationService.getAllOrganizations();

            expect(organizationsRepository.findAll).toHaveBeenCalledWith(true);
        });

        it("maps multiple organizations correctly", async () => {
            const org2: OrganizationDTO = {
                ...mockOrgDTO,
                orgId: "org-2",
                name: "Second Org",
                slug: "second-org",
            };
            vi.mocked(organizationsRepository.findAll).mockResolvedValue([
                mockOrgDTO,
                org2,
            ]);

            const result = await organizationService.getAllOrganizations();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Test Organization");
            expect(result[1].name).toBe("Second Org");
        });

        it("returns empty array when no organizations found", async () => {
            vi.mocked(organizationsRepository.findAll).mockResolvedValue([]);

            const result = await organizationService.getAllOrganizations();

            expect(result).toEqual([]);
        });
    });

    describe("getOrganizationBySlug", () => {
        it("returns organization when found", async () => {
            vi.mocked(organizationsRepository.findBySlug).mockResolvedValue(
                mockOrgDTO
            );

            const result =
                await organizationService.getOrganizationBySlug("test-org");

            expect(result).not.toBeNull();
            expect(result?.slug).toBe("test-org");
            expect(result?.name).toBe("Test Organization");
            expect(organizationsRepository.findBySlug).toHaveBeenCalledWith(
                "test-org"
            );
        });

        it("returns null when organization not found", async () => {
            vi.mocked(organizationsRepository.findBySlug).mockResolvedValue(
                null
            );

            const result =
                await organizationService.getOrganizationBySlug("non-existent");

            expect(result).toBeNull();
        });

        it("maps organization correctly", async () => {
            vi.mocked(organizationsRepository.findBySlug).mockResolvedValue(
                mockOrgDTO
            );

            const result =
                await organizationService.getOrganizationBySlug("test-org");

            expect(result).toEqual({
                orgId: "org-1",
                name: "Test Organization",
                slug: "test-org",
                motorsportregOrgId: "msr-123",
                description: "Test description",
                isPublic: true,
                createdAt: mockOrgDTO.createdAt,
                updatedAt: mockOrgDTO.updatedAt,
                deletedAt: null,
            });
        });
    });
});
