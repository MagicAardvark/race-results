import { db, orgApiKeys, orgs } from "@/db";
import {
    CreateOrgDTO,
    OrganizationAdminDTO,
    UpdateOrgDTO,
} from "@/dto/organizations";
import { generateApiKey } from "@/lib/auth/generate-api-key";
import { DatabaseError } from "@/lib/errors/app-errors";
import { eq } from "drizzle-orm/sql/expressions/conditions";

interface IOrganizationsAdminRepository {
    findAll(): Promise<OrganizationAdminDTO[]>;
    findById(orgId: string): Promise<OrganizationAdminDTO | null>;
    findBySlug(slug: string): Promise<OrganizationAdminDTO | null>;
    create(dto: CreateOrgDTO): Promise<string>;
    update(dto: UpdateOrgDTO): Promise<string>;
    delete(orgId: string): Promise<void>;
    createApiKey(
        orgId: string,
        isEnabled: boolean
    ): Promise<OrganizationAdminDTO>;
}

export class OrganizationsAdminRepository implements IOrganizationsAdminRepository {
    async findAll() {
        return await db.query.orgs.findMany({
            with: {
                orgApiKeys: true,
            },
            where: {
                deletedAt: { isNull: true },
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    async findById(orgId: string): Promise<OrganizationAdminDTO | null> {
        const org = await db.query.orgs.findFirst({
            with: {
                orgApiKeys: true,
            },
            where: {
                orgId: orgId,
                deletedAt: {
                    isNull: true,
                },
            },
        });

        return org ?? null;
    }

    async findBySlug(slug: string): Promise<OrganizationAdminDTO | null> {
        const org = await db.query.orgs.findFirst({
            with: {
                orgApiKeys: true,
            },
            where: {
                slug: slug,
                deletedAt: {
                    isNull: true,
                },
            },
        });

        return org ?? null;
    }

    async create(data: { name: string; slug: string }): Promise<string> {
        const [org] = await db
            .insert(orgs)
            .values({
                name: data.name,
                slug: data.slug,
            })
            .onConflictDoNothing({ target: [orgs.slug] })
            .returning({ slug: orgs.slug });

        if (!org) {
            throw new DatabaseError(
                "Organization with this slug already exists"
            );
        }

        return org.slug;
    }

    async update(dto: UpdateOrgDTO): Promise<string> {
        const [org] = await db
            .update(orgs)
            .set({
                name: dto.name,
                motorsportregOrgId: dto.motorsportregOrgId,
                description: dto.description,
                isPublic: dto.isPublic,
            })
            .where(eq(orgs.orgId, dto.orgId))
            .returning({ slug: orgs.slug });

        return org.slug;
    }

    async delete(orgId: string): Promise<void> {
        await db
            .update(orgs)
            .set({ deletedAt: new Date() })
            .where(eq(orgs.orgId, orgId));
    }

    async createApiKey(
        orgId: string,
        isEnabled: boolean
    ): Promise<OrganizationAdminDTO> {
        const apiKey = generateApiKey();

        const result = await db
            .insert(orgApiKeys)
            .values({
                orgId: orgId,
                apiKey: apiKey,
                apiKeyEnabled: isEnabled,
            })
            .returning();

        if (!result) {
            throw new DatabaseError("Failed to create API key");
        }

        const org = await this.findById(orgId);

        if (!org) {
            throw new DatabaseError(
                "Organization not found after creating API key"
            );
        }

        return org;
    }
}

export const organizationsAdminRepository = new OrganizationsAdminRepository();
