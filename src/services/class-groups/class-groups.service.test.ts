import { describe, it, expect, vi, beforeEach } from "vitest";
import { classGroupsService } from "./class-groups.service";
import { classGroupsRepository } from "@/db/repositories/class-groups.repo";
import type {
    ClassGroupCreateDTO,
    ClassGroupUpdateDTO,
    ClassGroupWithClasses,
} from "@/dto/class-groups";

vi.mock("@/db/repositories/class-groups.repo", () => ({
    classGroupsRepository: {
        getClassGroupsForOrg: vi.fn(),
        getClassGroup: vi.fn(),
        getAvailableBaseClasses: vi.fn(),
        createClassGroup: vi.fn(),
        updateClassGroup: vi.fn(),
        deleteClassGroup: vi.fn(),
    },
}));

describe("ClassGroupsService", () => {
    const mockClassGroup: ClassGroupWithClasses = {
        classGroupId: "group-1",
        shortName: "SSM",
        longName: "Super Street Modified",
        isEnabled: true,
        orgId: "org-1",
        classIds: ["class-1"],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getClassGroupsForOrg", () => {
        it("delegates to repository", async () => {
            const mockGroups = [mockClassGroup];
            vi.mocked(
                classGroupsRepository.getClassGroupsForOrg
            ).mockResolvedValue(mockGroups);

            const result =
                await classGroupsService.getClassGroupsForOrg("org-1");

            expect(
                classGroupsRepository.getClassGroupsForOrg
            ).toHaveBeenCalledWith("org-1");
            expect(result).toEqual(mockGroups);
        });

        it("handles null orgId", async () => {
            const mockGroups = [mockClassGroup];
            vi.mocked(
                classGroupsRepository.getClassGroupsForOrg
            ).mockResolvedValue(mockGroups);

            const result = await classGroupsService.getClassGroupsForOrg(null);

            expect(
                classGroupsRepository.getClassGroupsForOrg
            ).toHaveBeenCalledWith(null);
            expect(result).toEqual(mockGroups);
        });
    });

    describe("getClassGroup", () => {
        it("delegates to repository", async () => {
            vi.mocked(classGroupsRepository.getClassGroup).mockResolvedValue(
                mockClassGroup
            );

            const result = await classGroupsService.getClassGroup(
                "group-1",
                "org-1"
            );

            expect(classGroupsRepository.getClassGroup).toHaveBeenCalledWith(
                "group-1",
                "org-1"
            );
            expect(result).toEqual(mockClassGroup);
        });

        it("returns null when class group not found", async () => {
            vi.mocked(classGroupsRepository.getClassGroup).mockResolvedValue(
                null
            );

            const result = await classGroupsService.getClassGroup(
                "group-1",
                "org-1"
            );

            expect(result).toBeNull();
        });
    });

    describe("getAvailableBaseClasses", () => {
        it("delegates to repository", async () => {
            const mockClasses = [
                {
                    classId: "class-1",
                    shortName: "SS",
                    longName: "Super Street",
                    orgId: null,
                },
            ];
            vi.mocked(
                classGroupsRepository.getAvailableBaseClasses
            ).mockResolvedValue(mockClasses);

            const result =
                await classGroupsService.getAvailableBaseClasses("org-1");

            expect(
                classGroupsRepository.getAvailableBaseClasses
            ).toHaveBeenCalledWith("org-1");
            expect(result).toEqual(mockClasses);
        });
    });

    describe("createClassGroup", () => {
        it("delegates to repository", async () => {
            const createDTO: ClassGroupCreateDTO = {
                shortName: "SSM",
                longName: "Super Street Modified",
                orgId: "org-1",
                classIds: ["class-1"],
            };

            vi.mocked(classGroupsRepository.createClassGroup).mockResolvedValue(
                mockClassGroup
            );

            const result = await classGroupsService.createClassGroup(createDTO);

            expect(classGroupsRepository.createClassGroup).toHaveBeenCalledWith(
                createDTO
            );
            expect(result).toEqual(mockClassGroup);
        });
    });

    describe("updateClassGroup", () => {
        it("delegates to repository", async () => {
            const updateDTO: ClassGroupUpdateDTO = {
                classGroupId: "group-1",
                shortName: "SSM",
                longName: "Super Street Modified",
                isEnabled: true,
                classIds: ["class-1"],
            };

            vi.mocked(classGroupsRepository.updateClassGroup).mockResolvedValue(
                mockClassGroup
            );

            const result = await classGroupsService.updateClassGroup(updateDTO);

            expect(classGroupsRepository.updateClassGroup).toHaveBeenCalledWith(
                updateDTO
            );
            expect(result).toEqual(mockClassGroup);
        });
    });

    describe("deleteClassGroup", () => {
        it("delegates to repository", async () => {
            vi.mocked(classGroupsRepository.deleteClassGroup).mockResolvedValue(
                undefined
            );

            await classGroupsService.deleteClassGroup("group-1", "org-1");

            expect(classGroupsRepository.deleteClassGroup).toHaveBeenCalledWith(
                "group-1",
                "org-1"
            );
        });

        it("handles null orgId", async () => {
            vi.mocked(classGroupsRepository.deleteClassGroup).mockResolvedValue(
                undefined
            );

            await classGroupsService.deleteClassGroup("group-1", null);

            expect(classGroupsRepository.deleteClassGroup).toHaveBeenCalledWith(
                "group-1",
                null
            );
        });
    });
});
