import { organizationsAPIRepository } from "@/db/repositories/organizations.api.repo";

interface IOrganizationsAPIService {
    validateApiRequest(slug: string, apiKey: string): Promise<boolean>;
}

export class OrganizationsAPIService implements IOrganizationsAPIService {
    async validateApiRequest(slug: string, apiKey: string): Promise<boolean> {
        return await organizationsAPIRepository.validateApiRequest(
            slug,
            apiKey
        );
    }
}

export const organizationsAPIService = new OrganizationsAPIService();
