import { baseClasses, classCategories, classTypes, db } from "@/db";
import {
    BaseCarClassCreateDTO,
    BaseCarClassDTO,
    BaseCarClassUpdateDTO,
    ClassCategoryDTO,
    ClassTypeDTO,
} from "@/dto/classes-admin";
import { asc, eq, sql } from "drizzle-orm";

interface IClassesAdminRepository {
    getGlobalBaseClasses(): Promise<BaseCarClassDTO[]>;
    getGlobalBaseClass(classId: string): Promise<BaseCarClassDTO | null>;
    getClassTypes(): Promise<ClassTypeDTO[]>;
    getClassCategories(): Promise<ClassCategoryDTO[]>;
    doesShortNameExist(
        shortName: string,
        orgId?: string | null
    ): Promise<boolean>;
    createGlobalBaseClass(
        data: BaseCarClassCreateDTO
    ): Promise<BaseCarClassDTO>;
    updateGlobalBaseClass(
        data: BaseCarClassUpdateDTO
    ): Promise<BaseCarClassDTO>;
}

export class ClassesAdminRepository implements IClassesAdminRepository {
    async getGlobalBaseClasses(): Promise<BaseCarClassDTO[]> {
        return await db
            .select()
            .from(baseClasses)
            .leftJoin(
                classTypes,
                eq(baseClasses.classTypeKey, classTypes.classTypeKey)
            )
            .leftJoin(
                classCategories,
                eq(baseClasses.classCategoryId, classCategories.classCategoryId)
            )
            .orderBy(
                sql`COALESCE(${classTypes.relativeOrder}, 999)`,
                sql`COALESCE(${classCategories.relativeOrder}, 999)`,
                asc(baseClasses.relativeOrder)
            );
    }

    async getGlobalBaseClass(classId: string): Promise<BaseCarClassDTO | null> {
        const result = await db
            .select()
            .from(baseClasses)
            .leftJoin(
                classTypes,
                eq(baseClasses.classTypeKey, classTypes.classTypeKey)
            )
            .leftJoin(
                classCategories,
                eq(baseClasses.classCategoryId, classCategories.classCategoryId)
            )
            .where(eq(baseClasses.classId, classId))
            .orderBy(
                sql`COALESCE(${classTypes.relativeOrder}, 999)`,
                sql`COALESCE(${classCategories.relativeOrder}, 999)`,
                asc(baseClasses.relativeOrder)
            );

        return result.length > 0 ? result[0] : null;
    }

    async getClassTypes(): Promise<ClassTypeDTO[]> {
        return db.query.classTypes.findMany({
            orderBy: (ct) => [asc(ct.relativeOrder)],
        });
    }

    async getClassCategories(): Promise<ClassCategoryDTO[]> {
        return db.query.classCategories.findMany({
            orderBy: (cc) => [asc(cc.relativeOrder)],
        });
    }

    async doesShortNameExist(
        shortName: string,
        orgId: string | null = null
    ): Promise<boolean> {
        const baseClass = await db.query.baseClasses.findFirst({
            where: {
                shortName: shortName,
                orgId: orgId ?? { isNull: true },
            },
        });

        return baseClass !== undefined;
    }

    async createGlobalBaseClass(
        data: BaseCarClassCreateDTO
    ): Promise<BaseCarClassDTO> {
        const [newBaseClass] = await db
            .insert(baseClasses)
            .values({
                shortName: data.shortName,
                longName: data.longName,
                classTypeKey: data.classTypeKey,
                classCategoryId: data.classCategoryId,
                isEnabled: true,
                orgId: null,
            })
            .onConflictDoUpdate({
                target: [baseClasses.shortName, baseClasses.orgId],
                set: {
                    isEnabled: true,
                },
            })
            .returning({ classId: baseClasses.classId });

        const updatedBaseClass = await this.getGlobalBaseClass(
            newBaseClass.classId
        );

        if (!updatedBaseClass) {
            throw new Error("Failed to retrieve the newly created base class.");
        }

        return updatedBaseClass;
    }

    async updateGlobalBaseClass(
        data: BaseCarClassUpdateDTO
    ): Promise<BaseCarClassDTO> {
        await db
            .update(baseClasses)
            .set({
                shortName: data.shortName,
                longName: data.longName,
                classTypeKey: data.classTypeKey,
                classCategoryId: data.classCategoryId,
                isEnabled: data.isEnabled,
            })
            .where(eq(baseClasses.classId, data.classId));

        const updatedBaseClass = await this.getGlobalBaseClass(data.classId);

        if (!updatedBaseClass) {
            throw new Error("Failed to retrieve the newly created base class.");
        }

        return updatedBaseClass;
    }
}

export const classesAdminRepository = new ClassesAdminRepository();
