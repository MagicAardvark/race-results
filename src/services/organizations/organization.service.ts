import {
    CreateOrgDTO,
    Organization,
    OrganizationDTO,
    UpdateOrgDTO,
} from "@/dto/organizations";
import { organizationsRepository } from "@/db/repositories/organizations.repo";
import { ValidationError } from "@/lib/errors/app-errors";

interface IOrganizationService {
    getAllOrganizations(): Promise<Organization[]>;
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

    async getAllOrganizations() {
        return mapOrganizations(await organizationsRepository.findAll());
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

        return await organizationsRepository.update(dto);
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
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
    };
};

export const organizationService = new OrganizationService();
