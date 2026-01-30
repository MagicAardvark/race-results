import { orgs } from "@/db/tables/orgs";
import { sql } from "drizzle-orm";
import { pgView, text, uuid } from "drizzle-orm/pg-core";

export const activeOrgApiKeys = pgView("orgs_active_api_keys_vw", {
    apiKeyId: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
        .notNull()
        .references(() => orgs.orgId, { onDelete: "cascade" }),
    apiKey: text("api_key").notNull(),
}).as(sql`
WITH Ordered AS (
    SELECT
        id,
        api_key,
        org_id,
        api_key_enabled,
        ROW_NUMBER() OVER (PARTITION BY org_id ORDER BY effective_at DESC) as row_num
    FROM public.org_api_keys as apiKey
)

SELECT
    id,
    api_key,
    org_id
FROM Ordered
WHERE
    row_num = 1
AND api_key_enabled = true
`);
