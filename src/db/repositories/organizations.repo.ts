import { db, orgs } from "@/db";
import { OrganizationDTO } from "@/dto/organizations";
import { and, eq, isNotNull, isNull } from "drizzle-orm";

interface IOrganizationsRepository {
    findAll(): Promise<OrganizationDTO[]>;
    findBySlug(slug: string): Promise<OrganizationDTO | null>;
}

export class OrganizationsRepository implements IOrganizationsRepository {
    async findAll() {
        return await db.query.orgs.findMany({
            where: isNull(orgs.deletedAt),
        });
    }

    async findBySlug(slug: string): Promise<typeof orgs.$inferSelect | null> {
        const org = await db.query.orgs.findFirst({
            where: and(eq(orgs.slug, slug), isNotNull(orgs.deletedAt)),
        });

        return org ?? null;
    }
}

export const organizationsRepository = new OrganizationsRepository();
