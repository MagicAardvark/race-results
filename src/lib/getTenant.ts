import { db } from "@/db";
import { eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";

export async function getTenant() {
    const h = await headers();
    const slug = h.get("x-tenant-slug");

    if (!slug) {
        return {
            isGlobal: true
        };
    }

    const tenant = await db.query.orgs.findFirst({
        where: (orgs, { and }) => and(
            isNull(orgs.deletedAt),
            eq(orgs.slug, slug)
        )
    });

    return {
        tenant: tenant,
        isGlobal: false
    };
}