import { baseClasses, db } from "@/db";
import {
    BaseCarClassCreateDTO,
    BaseCarClassDTO,
    BaseCarClassUpdateDTO,
} from "@/dto/classes-admin";
import { eq } from "drizzle-orm";

interface IClassesAdminRepository {
    getGlobalBaseClasses(): Promise<BaseCarClassDTO[]>;
    getGlobalBaseClass(classId: string): Promise<BaseCarClassDTO | null>;
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
    getGlobalBaseClasses(): Promise<BaseCarClassDTO[]> {
        return db.query.baseClasses.findMany({
            where: {
                orgId: { isNull: true },
            },
            orderBy: {
                shortName: "asc",
            },
        });
    }

    async getGlobalBaseClass(classId: string): Promise<BaseCarClassDTO | null> {
        const baseClass = await db.query.baseClasses.findFirst({
            where: {
                classId: classId,
            },
        });

        return baseClass ?? null;
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
                isEnabled: true,
                orgId: null,
            })
            .onConflictDoUpdate({
                target: [baseClasses.shortName, baseClasses.orgId],
                set: {
                    isEnabled: true,
                },
            })
            .returning();

        return newBaseClass;
    }

    async updateGlobalBaseClass(
        data: BaseCarClassUpdateDTO
    ): Promise<BaseCarClassDTO> {
        const [updatedBaseClass] = await db
            .update(baseClasses)
            .set({
                shortName: data.shortName,
                longName: data.longName,
                isEnabled: data.isEnabled,
            })
            .where(eq(baseClasses.classId, data.classId))
            .returning();

        return updatedBaseClass;
    }
}

export const classesAdminRepository = new ClassesAdminRepository();
