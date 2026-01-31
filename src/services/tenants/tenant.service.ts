import { HEADERS } from "@/constants/global";
import { InvalidTenant, Tenant, ValidTenant } from "@/dto/tenants";
import { organizationService } from "@/services/organizations/organization.service";
import { headers } from "next/headers";

interface ITenantService {
    getTenant(): Promise<Tenant>;
    isValidTenant(slug: string): Promise<boolean>;
}

export class TenantService implements ITenantService {
    async getTenant(): Promise<Tenant> {
        const h = await headers();
        const slug = h.get(HEADERS.TENANT_SLUG);

        if (!slug) {
            return {
                isValid: false,
            } as InvalidTenant;
        }

        const org = await organizationService.getOrganizationBySlug(slug);

        if (!org) {
            return {
                isValid: false,
            } as InvalidTenant;
        }

        return {
            isValid: true,
            org: org,
            isGlobal: false,
        } as ValidTenant;
    }

    async isValidTenant(slug: string): Promise<boolean> {
        const org = await organizationService.getOrganizationBySlug(slug);

        return org !== null;
    }
}

export const tenantService = new TenantService();
