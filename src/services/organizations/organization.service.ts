import { Organization, OrganizationDTO } from "@/dto/organizations";
import { organizationsRepository } from "@/db/repositories/organizations.repo";

interface IOrganizationService {
    getAllOrganizations(publicOnly?: boolean): Promise<Organization[]>;
    getOrganizationBySlug(slug: string): Promise<Organization | null>;
}

export class OrganizationService implements IOrganizationService {
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
