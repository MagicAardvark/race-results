import { organizationsAdminRepository } from "@/db/repositories/organizations.admin.repo";
import { organizationsRepository } from "@/db/repositories/organizations.repo";
import {
    CreateOrgDTO,
    OrganizationAdminDTO,
    OrganizationExtended,
    UpdateOrgDTO,
} from "@/dto/organizations";
import { ValidationError } from "@/lib/errors/app-errors";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";

interface IOrganizationAdminService {
    getAll(): Promise<OrganizationExtended[]>;
    findBySlug(slug: string): Promise<OrganizationExtended | null>;
    createOrganization(dto: CreateOrgDTO): Promise<string>;
    updateOrganization(dto: UpdateOrgDTO): Promise<string>;
    deleteOrganization(orgId: string): Promise<void>;
    createApiKey(
        orgId: string,
        isEnabled: boolean
    ): Promise<OrganizationExtended>;
}

export class OrganizationAdminService implements IOrganizationAdminService {
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    async getAll(): Promise<OrganizationExtended[]> {
        const orgs = await organizationsAdminRepository.findAll();

        return orgs.map((org) => mapOrganization(org));
    }

    async findBySlug(slug: string): Promise<OrganizationExtended | null> {
        const org = await organizationsAdminRepository.findBySlug(slug);

        return org ? mapOrganization(org) : null;
    }

    async createOrganization(dto: CreateOrgDTO): Promise<string> {
        const slug = this.generateSlug(dto.name);

        const existing = await organizationsAdminRepository.findBySlug(slug);

        if (existing) {
            throw new ValidationError(
                `An organization with this slug already exists: ${slug}`
            );
        }

        const existingName = await organizationsRepository.findByName(dto.name);

        if (existingName) {
            throw new ValidationError(
                "An organization with this name already exists"
            );
        }

        return await organizationsAdminRepository.create({
            name: dto.name,
            slug: slug,
        });
    }

    async updateOrganization(dto: UpdateOrgDTO): Promise<string> {
        const existingName = await organizationsRepository.findByName(dto.name);

        if (existingName && existingName.orgId !== dto.orgId) {
            throw new ValidationError(
                "Organization with this name already exists"
            );
        }

        const slug = await organizationsAdminRepository.update(dto);

        // Update feature flags if provided
        if (dto.featureFlags) {
            await featureFlagsService.updateOrgFeatureFlags(
                dto.orgId,
                dto.featureFlags
            );
        }

        return slug;
    }

    async deleteOrganization(orgId: string): Promise<void> {
        await organizationsAdminRepository.delete(orgId);
    }

    async createApiKey(
        orgId: string,
        isEnabled: boolean
    ): Promise<OrganizationExtended> {
        const org = await organizationsAdminRepository.createApiKey(
            orgId,
            isEnabled
        );

        return mapOrganization(org);
    }
}

const mapOrganization = (data: OrganizationAdminDTO): OrganizationExtended => {
    return {
        orgId: data.orgId,
        name: data.name,
        slug: data.slug,
        motorsportregOrgId: data.motorsportregOrgId,
        description: data.description,
        isPublic: data.isPublic,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        orgApiKeys: data.orgApiKeys
            .sort((a, b) => b.effectiveAt.getTime() - a.effectiveAt.getTime())
            .map((apiKey) => ({
                apiKeyId: apiKey.apiKeyId,
                apiKey: apiKey.apiKey,
                apiKeyEnabled: apiKey.apiKeyEnabled,
                effectiveAt: apiKey.effectiveAt,
            })),
    };
};

export const organizationAdminService = new OrganizationAdminService();
