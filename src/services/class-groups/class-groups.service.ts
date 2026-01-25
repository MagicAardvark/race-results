import { classGroupsRepository } from "@/db/repositories/class-groups.repo";
import {
    ClassGroupCreateDTO,
    ClassGroupUpdateDTO,
    ClassGroupWithClasses,
} from "@/dto/class-groups";

interface IClassGroupsService {
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

export class ClassGroupsService implements IClassGroupsService {
    async getClassGroupsForOrg(
        orgId: string | null
    ): Promise<ClassGroupWithClasses[]> {
        return classGroupsRepository.getClassGroupsForOrg(orgId);
    }

    async getClassGroup(
        classGroupId: string,
        orgId: string | null
    ): Promise<ClassGroupWithClasses | null> {
        return classGroupsRepository.getClassGroup(classGroupId, orgId);
    }

    async getAvailableBaseClasses(orgId: string | null) {
        return classGroupsRepository.getAvailableBaseClasses(orgId);
    }

    async createClassGroup(
        data: ClassGroupCreateDTO
    ): Promise<ClassGroupWithClasses> {
        return classGroupsRepository.createClassGroup(data);
    }

    async updateClassGroup(
        data: ClassGroupUpdateDTO
    ): Promise<ClassGroupWithClasses> {
        return classGroupsRepository.updateClassGroup(data);
    }

    async deleteClassGroup(
        classGroupId: string,
        orgId: string | null
    ): Promise<void> {
        return classGroupsRepository.deleteClassGroup(classGroupId, orgId);
    }
}

export const classGroupsService = new ClassGroupsService();
