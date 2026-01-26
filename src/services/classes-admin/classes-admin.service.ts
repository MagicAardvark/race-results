import { CLASSING } from "@/constants/global";
import { classesAdminRepository } from "@/db/repositories/classes-admin.repo";
import {
    BaseCarClass,
    BaseCarClassCreateDTO,
    BaseCarClassDTO,
    BaseCarClassUpdateDTO,
    ClassCategory,
    ClassType,
} from "@/dto/classes-admin";
import { getEffectiveDateRangeForYear } from "@/lib/effective-date-utils";
import { ValidationError } from "@/lib/errors/app-errors";

interface IClassesAdminService {
    getGlobalBaseClasses(): Promise<BaseCarClass[]>;
    getGlobalBaseClass(classId: string): Promise<BaseCarClass | null>;
    getClassTypes(): Promise<ClassType[]>;
    getClassCategories(): Promise<ClassCategory[]>;
    createGlobalBaseClass(data: BaseCarClassCreateDTO): Promise<BaseCarClass>;
    updateGlobalBaseClass(data: BaseCarClassUpdateDTO): Promise<BaseCarClass>;
    createIndexValue(
        classId: string,
        indexValue: number,
        year: number
    ): Promise<void>;
    updateIndexValue(indexValueId: string, indexValue: number): Promise<void>;
}

export class ClassesAdminService implements IClassesAdminService {
    async getGlobalBaseClasses(): Promise<BaseCarClass[]> {
        const baseClasses = await classesAdminRepository.getGlobalBaseClasses();

        return this.map(baseClasses);
    }

    async getGlobalBaseClass(classId: string): Promise<BaseCarClass | null> {
        const baseClass =
            await classesAdminRepository.getGlobalBaseClass(classId);

        if (!baseClass) {
            return null;
        }

        return this.map([baseClass])[0];
    }

    async getClassTypes(): Promise<ClassType[]> {
        const classTypes = await classesAdminRepository.getClassTypes();

        return classTypes.map((ct) => ({
            classTypeId: ct.classTypeId,
            classTypeKey: ct.classTypeKey,
            shortName: ct.shortName,
            longName: ct.longName,
            isEnabled: ct.isEnabled,
        }));
    }

    async getClassCategories(): Promise<ClassCategory[]> {
        const classCategories =
            await classesAdminRepository.getClassCategories();

        return classCategories.map((cc) => ({
            classCategoryId: cc.classCategoryId,
            shortName: cc.shortName,
            longName: cc.longName,
            isEnabled: cc.isEnabled,
        }));
    }

    async createGlobalBaseClass(
        data: BaseCarClassCreateDTO
    ): Promise<BaseCarClass> {
        const doesShortNameExist =
            await classesAdminRepository.doesShortNameExist(data.shortName);

        if (doesShortNameExist) {
            throw new ValidationError(
                `A base class with the short name '${data.shortName}' already exists.`
            );
        }

        if (
            data.isIndexed &&
            (!data.indexValue || data.indexValue <= 0 || data.indexValue > 1)
        ) {
            throw new ValidationError(
                "An index value must be provided when indexing is enabled, and must be greater than 0 and less than or equal to 1."
            );
        }

        const newBaseClass = await classesAdminRepository.createGlobalBaseClass(
            {
                shortName: data.shortName,
                longName: data.longName,
                classTypeKey: data.classTypeKey,
                classCategoryId: data.classCategoryId,
                isIndexed: data.isIndexed,
                indexValue: data.indexValue,
            }
        );

        const currentYear = new Date().getFullYear();

        const indexValue = data.isIndexed
            ? (data.indexValue ?? CLASSING.DEFAULT_INDEX_VALUE)
            : CLASSING.DEFAULT_INDEX_VALUE;

        await this.createIndexValue(
            newBaseClass.classes_base.classId,
            indexValue,
            currentYear
        );

        return this.map([newBaseClass])[0];
    }

    async updateGlobalBaseClass(
        data: BaseCarClassUpdateDTO
    ): Promise<BaseCarClass> {
        const existingBaseClass = await this.getGlobalBaseClass(data.classId);

        if (existingBaseClass && existingBaseClass.classId !== data.classId) {
            throw new Error(
                `A base class with the short name '${data.shortName}' already exists.`
            );
        }

        const updateBaseClass =
            await classesAdminRepository.updateGlobalBaseClass(data);

        return this.map([updateBaseClass])[0];
    }

    async createIndexValue(
        classId: string,
        indexValue: number,
        year: number
    ): Promise<void> {
        const { effectiveFrom, effectiveTo } =
            getEffectiveDateRangeForYear(year);

        await classesAdminRepository.createIndexValue(
            classId,
            indexValue,
            effectiveFrom,
            effectiveTo
        );
    }

    async updateIndexValue(
        indexValueId: string,
        indexValue: number
    ): Promise<void> {
        await classesAdminRepository.updateIndexValue(indexValueId, indexValue);
    }

    private mapBaseClass(dto: BaseCarClassDTO): BaseCarClass {
        return {
            classId: dto.classes_base.classId,
            shortName: dto.classes_base.shortName,
            longName: dto.classes_base.longName,
            isIndexed: dto.classes_base.isIndexed,
            isEnabled: dto.classes_base.isEnabled,
            classCategory: dto.classes_categories
                ? {
                      classCategoryId: dto.classes_categories.classCategoryId,
                      shortName: dto.classes_categories.shortName,
                      longName: dto.classes_categories.longName,
                      isEnabled: dto.classes_categories.isEnabled,
                  }
                : null,
            classType: dto.classes_types
                ? {
                      classTypeId: dto.classes_types.classTypeId,
                      classTypeKey: dto.classes_types.classTypeKey,
                      shortName: dto.classes_types.shortName,
                      longName: dto.classes_types.longName,
                      isEnabled: dto.classes_types.isEnabled,
                  }
                : null,
            indexValues:
                dto.classes_index_values?.map((iv) => ({
                    indexValueId: iv.indexValueId,
                    value: parseFloat(iv.indexValue),
                    year: new Date(iv.effectiveFrom).getFullYear(),
                })) ?? [],
        };
    }

    private map(baseClassesDTO: BaseCarClassDTO[]): BaseCarClass[] {
        return baseClassesDTO.map((bc) => this.mapBaseClass(bc));
    }
}

export const classesAdminService = new ClassesAdminService();
