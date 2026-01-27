import { activeOrgApiKeys, db, orgs } from "@/db";
import { and, eq } from "drizzle-orm";

interface IOrganizationsAPIRepository {
    validateApiRequest(slug: string, apiKey: string): Promise<boolean>;
    getOrgIdFromApiKey(apiKey: string): Promise<string | null>;
}

export class OrganizationsAPIRepository implements IOrganizationsAPIRepository {
    async validateApiRequest(slug: string, apiKey: string): Promise<boolean> {
        const result = await db
            .select()
            .from(activeOrgApiKeys)
            .innerJoin(orgs, eq(activeOrgApiKeys.orgId, orgs.orgId))
            .where(
                and(eq(orgs.slug, slug), eq(activeOrgApiKeys.apiKey, apiKey))
            );

        if (result.length == 1) {
            return true;
        }

        return false;
    }

    async getOrgIdFromApiKey(apiKey: string): Promise<string | null> {
        const result = await db.query.activeOrgApiKeys.findFirst({
            with: {
                org: true,
            },
            where: {
                apiKey: apiKey,
            },
        });

        return result ? result.org.orgId : null;
    }
}

export const organizationsAPIRepository = new OrganizationsAPIRepository();
