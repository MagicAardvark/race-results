import { HEADERS } from "@/constants/global";
import { Organization } from "@/dto/organizations";
import { organizationService } from "@/services/organizations/organization.service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface ITenantService {
    getTenant(): Promise<Organization>;
    isValidTenant(slug: string): Promise<boolean>;
}

export class TenantService implements ITenantService {
    async getTenant(): Promise<Organization> {
        const h = await headers();
        const slug = h.get(HEADERS.TENANT.SLUG);

        if (!slug) {
            redirect("/");
        }

        const org = await organizationService.getOrganizationBySlug(slug);

        if (!org) {
            redirect("/");
        }

        return org;
    }

    async isValidTenant(slug: string): Promise<boolean> {
        const org = await organizationService.getOrganizationBySlug(slug);

        return org !== null;
    }
}

export const tenantService = new TenantService();
