import { organizationsAPIRepository } from "@/db/repositories/organizations.api.repo";

interface IOrganizationsAPIService {
    validateApiRequest(slug: string, apiKey: string): Promise<boolean>;
    getOrgIdFromApiKey(apiKey: string): Promise<string | null>;
}

export class OrganizationsAPIService implements IOrganizationsAPIService {
    async validateApiRequest(slug: string, apiKey: string): Promise<boolean> {
        return await organizationsAPIRepository.validateApiRequest(
            slug,
            apiKey
        );
    }

    async getOrgIdFromApiKey(apiKey: string): Promise<string | null> {
        return await organizationsAPIRepository.getOrgIdFromApiKey(apiKey);
    }
}

export const organizationsAPIService = new OrganizationsAPIService();
