import { db } from "@/db";
import { eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";

export type TenantDetails = {
    org_id: string;
    name: string;
    slug: string;
};

type InvalidTenant = {
    isValid: false;
};

type GlobalTenant = {
    isValid: true;
    isGlobal: true;
};

type ValidTenant = {
    isValid: true;
    isGlobal: false;
    details: TenantDetails;
}

export type Tenant = InvalidTenant | GlobalTenant | ValidTenant;

export async function getTenant(): Promise<Tenant> {
    const h = await headers();
    const slug = h.get("x-tenant-slug");

    if (!slug) {
        return {
            isValid: false
        } as Tenant;
    }

    if (slug === "global") {
        return {
            isValid: true,
            isGlobal: true
        } as Tenant;
    }

    const tenant = await db.query.orgs.findFirst({
        where: (orgs, { and }) => and(
            isNull(orgs.deletedAt),
            eq(orgs.slug, slug)
        )
    });

    if (typeof tenant === 'undefined') {
        return {
            isValid: false
        } as Tenant;
    }

    return {
        isValid: true,
        details: tenant,
        isGlobal: false
    } as Tenant;
}