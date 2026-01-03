import {
    CreateOrgDTO,
    Organization,
    OrganizationDTO,
    UpdateOrgDTO,
} from "@/dto/organizations";
import { organizationsRepository } from "@/db/repositories/organizations.repo";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { ValidationError } from "@/lib/errors/app-errors";

interface IOrganizationService {
    getAllOrganizations(publicOnly?: boolean): Promise<Organization[]>;
    getOrganizationBySlug(slug: string): Promise<Organization | null>;
    createOrganization(dto: CreateOrgDTO): Promise<Organization>;
    updateOrganization(dto: UpdateOrgDTO): Promise<Organization>;
    deleteOrganization(orgId: string): Promise<void>;
}

export class OrganizationService implements IOrganizationService {
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    async getAllOrganizations(
        publicOnly: boolean = true
    ): Promise<Organization[]> {
        return mapOrganizations(
            await organizationsRepository.findAll(publicOnly)
        );
    }

    async getOrganizationBySlug(slug: string): Promise<Organization | null> {
        const org = await organizationsRepository.findBySlug(slug);

        return org ? mapOrganization(org) : null;
    }

    async createOrganization(dto: CreateOrgDTO): Promise<Organization> {
        const slug = this.generateSlug(dto.name);

        const existing = await organizationsRepository.findBySlug(slug);

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

        return await organizationsRepository.create({
            name: dto.name,
            slug: slug,
        });
    }

    async updateOrganization(dto: UpdateOrgDTO): Promise<Organization> {
        const existingName = await organizationsRepository.findByName(dto.name);

        if (existingName && existingName.orgId !== dto.orgId) {
            throw new ValidationError(
                "Organization with this name already exists"
            );
        }

        const org = await organizationsRepository.update(dto);

        // Update feature flags if provided
        if (dto.featureFlags) {
            await featureFlagsService.updateOrgFeatureFlags(
                dto.orgId,
                dto.featureFlags
            );
        }

        return org;
    }

    async deleteOrganization(orgId: string): Promise<void> {
        await organizationsRepository.delete(orgId);
    }
}

const mapOrganizations = (data: OrganizationDTO[]) => {
    return data.map(mapOrganization);
};

const mapOrganization = (data: OrganizationDTO) => {
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
    };
};

export const organizationService = new OrganizationService();
