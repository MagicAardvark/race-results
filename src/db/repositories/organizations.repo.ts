import { db, orgs } from "@/db";
import {
    CreateOrgDTO,
    OrganizationDTO,
    UpdateOrgDTO,
} from "@/dto/organizations";
import { DatabaseError } from "@/lib/errors/app-errors";
import { eq } from "drizzle-orm";

interface IOrganizationsRepository {
    findAll(publicOnly?: boolean): Promise<OrganizationDTO[]>;
    findById(orgId: string): Promise<OrganizationDTO | null>;
    findBySlug(slug: string): Promise<OrganizationDTO | null>;
    findByName(name: string): Promise<OrganizationDTO | null>;
    create(dto: CreateOrgDTO): Promise<OrganizationDTO>;
    update(dto: UpdateOrgDTO): Promise<OrganizationDTO>;
    delete(orgId: string): Promise<void>;
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

    async create(data: {
        name: string;
        slug: string;
    }): Promise<OrganizationDTO> {
        const [org] = await db
            .insert(orgs)
            .values({
                name: data.name,
                slug: data.slug,
            })
            .onConflictDoNothing({ target: [orgs.slug] })
            .returning();

        if (!org) {
            throw new DatabaseError(
                "Organization with this slug already exists"
            );
        }

        return org;
    }

    async update(dto: UpdateOrgDTO): Promise<OrganizationDTO> {
        const [org] = await db
            .update(orgs)
            .set({
                name: dto.name,
                description: dto.description,
                isPublic: dto.isPublic,
            })
            .where(eq(orgs.orgId, dto.orgId))
            .returning();

        return org;
    }

    async delete(orgId: string): Promise<void> {
        await db
            .update(orgs)
            .set({ deletedAt: new Date() })
            .where(eq(orgs.orgId, orgId));
    }
}

export const organizationsRepository = new OrganizationsRepository();
