import { baseClasses, classGroupClasses, classGroups, db } from "@/db";
import {
    ClassGroupCreateDTO,
    ClassGroupUpdateDTO,
    ClassGroupWithClasses,
} from "@/dto/class-groups";
import { asc, eq, isNull, or } from "drizzle-orm";
import { and } from "drizzle-orm/sql";

interface IClassGroupsRepository {
    getClassGroupsForOrg(
        orgId: string | null
    ): Promise<ClassGroupWithClasses[]>;
    getClassGroup(
        classGroupId: string,
        orgId: string | null
    ): Promise<ClassGroupWithClasses | null>;
    getAvailableBaseClasses(orgId: string | null): Promise<
        Array<{
            classId: string;
            shortName: string;
            longName: string;
            orgId: string | null;
        }>
    >;
    createClassGroup(data: ClassGroupCreateDTO): Promise<ClassGroupWithClasses>;
    updateClassGroup(data: ClassGroupUpdateDTO): Promise<ClassGroupWithClasses>;
    deleteClassGroup(classGroupId: string, orgId: string | null): Promise<void>;
}

export class ClassGroupsRepository implements IClassGroupsRepository {
    async getClassGroupsForOrg(
        orgId: string | null
    ): Promise<ClassGroupWithClasses[]> {
        const groups = await db.query.classGroups.findMany({
            where:
                orgId === null
                    ? { orgId: { isNull: true } }
                    : {
                          OR: [{ orgId: { isNull: true } }, { orgId }],
                      },
            orderBy: (cg) => [cg.shortName],
        });

        const result: ClassGroupWithClasses[] = [];

        for (const group of groups) {
            const classIds = await this.getClassIdsForGroup(group.classGroupId);
            result.push({
                ...group,
                classIds,
            });
        }

        return result;
    }

    async getClassGroup(
        classGroupId: string,
        orgId: string | null
    ): Promise<ClassGroupWithClasses | null> {
        const group = await db.query.classGroups.findFirst({
            where: {
                classGroupId,
                ...(orgId === null
                    ? { orgId: { isNull: true } }
                    : {
                          OR: [{ orgId: { isNull: true } }, { orgId }],
                      }),
            },
        });

        if (!group) {
            return null;
        }

        const classIds = await this.getClassIdsForGroup(classGroupId);

        return {
            ...group,
            classIds,
        };
    }

    async getAvailableBaseClasses(orgId: string | null) {
        const classes = await db
            .select({
                classId: baseClasses.classId,
                shortName: baseClasses.shortName,
                longName: baseClasses.longName,
                orgId: baseClasses.orgId,
            })
            .from(baseClasses)
            .where(
                orgId === null
                    ? eq(baseClasses.isEnabled, true)
                    : and(
                          eq(baseClasses.isEnabled, true),
                          or(
                              isNull(baseClasses.orgId),
                              eq(baseClasses.orgId, orgId)
                          )
                      )
            )
            .orderBy(asc(baseClasses.shortName));

        return classes;
    }

    async createClassGroup(
        data: ClassGroupCreateDTO
    ): Promise<ClassGroupWithClasses> {
        // Check if short name already exists for this org
        const existing = await db.query.classGroups.findFirst({
            where: {
                shortName: data.shortName,
                orgId: data.orgId ?? { isNull: true },
            },
        });

        if (existing) {
            throw new Error(
                `A class group with the short name '${data.shortName}' already exists.`
            );
        }

        const [newGroup] = await db
            .insert(classGroups)
            .values({
                shortName: data.shortName,
                longName: data.longName,
                orgId: data.orgId,
                isEnabled: true,
            })
            .returning();

        // Add classes to the group if provided
        if (data.classIds && data.classIds.length > 0) {
            // Verify all classes are available (global or org-specific)
            const availableClasses = await this.getAvailableBaseClasses(
                data.orgId
            );
            const availableClassIds = new Set(
                availableClasses.map((c) => c.classId)
            );

            const invalidClassIds = data.classIds.filter(
                (id) => !availableClassIds.has(id)
            );

            if (invalidClassIds.length > 0) {
                // Rollback the group creation
                await db
                    .delete(classGroups)
                    .where(eq(classGroups.classGroupId, newGroup.classGroupId));

                throw new Error(
                    `Invalid class IDs: ${invalidClassIds.join(", ")}`
                );
            }

            await db.insert(classGroupClasses).values(
                data.classIds.map((classId) => ({
                    classGroupId: newGroup.classGroupId,
                    classId,
                }))
            );
        }

        return this.getClassGroup(
            newGroup.classGroupId,
            data.orgId
        ) as Promise<ClassGroupWithClasses>;
    }

    async updateClassGroup(
        data: ClassGroupUpdateDTO
    ): Promise<ClassGroupWithClasses> {
        const existing = await db.query.classGroups.findFirst({
            where: {
                classGroupId: data.classGroupId,
            },
        });

        if (!existing) {
            throw new Error("Class group not found");
        }

        // Check if short name conflicts with another group (excluding current)
        const conflict = await db.query.classGroups.findFirst({
            where: {
                shortName: data.shortName,
                classGroupId: data.classGroupId,
            },
        });

        if (!conflict || conflict.classGroupId !== data.classGroupId) {
            const otherConflict = await db.query.classGroups.findFirst({
                where: {
                    shortName: data.shortName,
                    orgId: existing.orgId ?? { isNull: true },
                },
            });

            if (
                otherConflict &&
                otherConflict.classGroupId !== data.classGroupId
            ) {
                throw new Error(
                    `A class group with the short name '${data.shortName}' already exists.`
                );
            }
        }

        // Update the group
        await db
            .update(classGroups)
            .set({
                shortName: data.shortName,
                longName: data.longName,
                isEnabled: data.isEnabled,
            })
            .where(eq(classGroups.classGroupId, data.classGroupId));

        // Update class associations if provided
        if (data.classIds !== undefined) {
            // Remove existing associations
            await db
                .delete(classGroupClasses)
                .where(eq(classGroupClasses.classGroupId, data.classGroupId));

            // Add new associations if any
            if (data.classIds.length > 0) {
                // Verify all classes are available
                const availableClasses = await this.getAvailableBaseClasses(
                    existing.orgId
                );
                const availableClassIds = new Set(
                    availableClasses.map((c) => c.classId)
                );

                const invalidClassIds = data.classIds.filter(
                    (id) => !availableClassIds.has(id)
                );

                if (invalidClassIds.length > 0) {
                    throw new Error(
                        `Invalid class IDs: ${invalidClassIds.join(", ")}`
                    );
                }

                await db.insert(classGroupClasses).values(
                    data.classIds.map((classId) => ({
                        classGroupId: data.classGroupId,
                        classId,
                    }))
                );
            }
        }

        return this.getClassGroup(
            data.classGroupId,
            existing.orgId
        ) as Promise<ClassGroupWithClasses>;
    }

    async deleteClassGroup(
        classGroupId: string,
        orgId: string | null
    ): Promise<void> {
        const group = await db.query.classGroups.findFirst({
            where: {
                classGroupId,
                orgId: orgId ?? { isNull: true },
            },
        });

        if (!group) {
            throw new Error(
                "Class group not found or you don't have permission"
            );
        }

        // Cascade delete will handle classGroupClasses
        await db
            .delete(classGroups)
            .where(eq(classGroups.classGroupId, classGroupId));
    }

    private async getClassIdsForGroup(classGroupId: string): Promise<string[]> {
        const associations = await db.query.classGroupClasses.findMany({
            where: {
                classGroupId,
            },
        });

        return associations.map((a) => a.classId);
    }
}

export const classGroupsRepository = new ClassGroupsRepository();
