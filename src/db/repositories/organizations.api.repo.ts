import { db } from "@/db";
import { sql } from "drizzle-orm/sql/sql";

interface IOrganizationsAPIRepository {
    validateApiRequest(slug: string, apiKey: string): Promise<boolean>;
}

export class OrganizationsAPIRepository implements IOrganizationsAPIRepository {
    async validateApiRequest(slug: string, apiKey: string): Promise<boolean> {
        const result = await db.execute(sql`
            WITH Ordered AS (
            SELECT
                api_key,
                ROW_NUMBER() OVER (ORDER BY effective_at DESC) as row_num
            FROM public.org_api_keys as apiKey
            INNER JOIN public.orgs as org
                ON apiKey.org_id = org.id
            WHERE
                org.slug = ${slug}
            )
            
            SELECT
                1
            FROM Ordered
            WHERE
                row_num = 1
            AND api_key = ${apiKey}`);

        if (result.rowCount == 1) {
            return true;
        }

        return false;
    }
}

export const organizationsAPIRepository = new OrganizationsAPIRepository();
