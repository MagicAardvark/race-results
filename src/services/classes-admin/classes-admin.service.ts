import { classesAdminRepository } from "@/db/repositories/classes-admin.repo";
import {
    BaseCarClass,
    BaseCarClassCreateDTO,
    BaseCarClassUpdateDTO,
} from "@/dto/classes-admin";

interface IClassesAdminService {
    getGlobalBaseClasses(): Promise<BaseCarClass[]>;
    getGlobalBaseClass(classId: string): Promise<BaseCarClass | null>;
    createGlobalBaseClass(data: BaseCarClassCreateDTO): Promise<BaseCarClass>;
    updateGlobalBaseClass(data: BaseCarClassUpdateDTO): Promise<BaseCarClass>;
}

export class ClassesAdminService implements IClassesAdminService {
    async getGlobalBaseClasses(): Promise<BaseCarClass[]> {
        const baseClasses = await classesAdminRepository.getGlobalBaseClasses();

        return baseClasses.map((bc) => ({
            classId: bc.classId,
            shortName: bc.shortName,
            longName: bc.longName,
            isEnabled: bc.isEnabled,
        }));
    }

    async getGlobalBaseClass(classId: string): Promise<BaseCarClass | null> {
        const baseClass =
            await classesAdminRepository.getGlobalBaseClass(classId);

        if (!baseClass) {
            return null;
        }

        return {
            classId: baseClass.classId,
            shortName: baseClass.shortName,
            longName: baseClass.longName,
            isEnabled: baseClass.isEnabled,
        };
    }

    async createGlobalBaseClass(
        data: BaseCarClassCreateDTO
    ): Promise<BaseCarClass> {
        const doesShortNameExist =
            await classesAdminRepository.doesShortNameExist(data.shortName);

        if (doesShortNameExist) {
            throw new Error(
                `A base class with the short name '${data.shortName}' already exists.`
            );
        }

        const newBaseClass = await classesAdminRepository.createGlobalBaseClass(
            {
                shortName: data.shortName,
                longName: data.longName,
            }
        );

        return newBaseClass;
    }

    async updateGlobalBaseClass(
        data: BaseCarClassUpdateDTO
    ): Promise<BaseCarClass> {
        const existingBaseClass =
            await classesAdminRepository.getGlobalBaseClass(data.classId);

        if (existingBaseClass && existingBaseClass.classId !== data.classId) {
            throw new Error(
                `A base class with the short name '${data.shortName}' already exists.`
            );
        }

        const updateBaseClass =
            await classesAdminRepository.updateGlobalBaseClass(data);

        return updateBaseClass;
    }
}

export const classesAdminService = new ClassesAdminService();
