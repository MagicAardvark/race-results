import { db } from "@/db";
import { OrganizationDTO } from "@/dto/organizations";

interface IOrganizationsRepository {
    findAll(publicOnly?: boolean): Promise<OrganizationDTO[]>;
    findById(orgId: string): Promise<OrganizationDTO | null>;
    findBySlug(slug: string): Promise<OrganizationDTO | null>;
    findByName(name: string): Promise<OrganizationDTO | null>;
}

export class OrganizationsRepository implements IOrganizationsRepository {
    async findAll(publicOnly: boolean = true) {
        return await db.query.orgs.findMany({
            where: {
                deletedAt: { isNull: true },
                isPublic: publicOnly
                    ? {
                          eq: true,
                      }
                    : undefined,
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    async findById(id: string): Promise<OrganizationDTO | null> {
        const org = await db.query.orgs.findFirst({
            where: {
                orgId: id,
                deletedAt: {
                    isNull: true,
                },
            },
        });

        return org ?? null;
    }

    async findBySlug(slug: string): Promise<OrganizationDTO | null> {
        const org = await db.query.orgs.findFirst({
            where: {
                slug: slug,
                deletedAt: {
                    isNull: true,
                },
            },
        });

        return org ?? null;
    }

    async findByName(name: string): Promise<OrganizationDTO | null> {
        const org = await db.query.orgs.findFirst({
            where: {
                name: name,
                deletedAt: {
                    isNull: true,
                },
            },
        });

        return org ?? null;
    }
}

export const organizationsRepository = new OrganizationsRepository();
