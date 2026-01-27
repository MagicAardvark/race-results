import { describe, it, expect, vi, beforeEach } from "vitest";
import { classGroupsRepository } from "./class-groups.repo";
import { db, classGroups } from "@/db";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import { eq } from "drizzle-orm";

// Mock drizzle-orm to include isNull
vi.mock("drizzle-orm", async () => {
    const actual =
        await vi.importActual<typeof import("drizzle-orm")>("drizzle-orm");
    return {
        ...actual,
        isNull: vi.fn((column) => ({ isNull: true, column })),
    };
});

// Mock db.query and db operations
vi.mock("@/db", () => ({
    db: {
        query: {
            classGroups: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
            },
            classGroupClasses: {
                findMany: vi.fn(),
            },
        },
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    classGroups: {},
    classGroupClasses: {},
    baseClasses: {},
}));

describe("ClassGroupsRepository", () => {
    const orgId = "org-1";
    const mockGroup = {
        classGroupId: "group-1",
        shortName: "SSM",
        longName: "Super Street Modified",
        isEnabled: true,
        orgId: orgId,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
    };

    const mockClassGroupWithClasses: ClassGroupWithClasses = {
        ...mockGroup,
        classIds: ["class-1", "class-2"],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getClassGroupsForOrg", () => {
        it("returns class groups for org with class IDs", async () => {
            vi.mocked(db.query.classGroups.findMany).mockResolvedValue([
                mockGroup,
            ]);
            vi.mocked(
                db.query.classGroupClasses.findMany
            ).mockResolvedValueOnce([
                { classGroupId: "group-1", classId: "class-1" },
                { classGroupId: "group-1", classId: "class-2" },
            ]);

            const result =
                await classGroupsRepository.getClassGroupsForOrg(orgId);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockClassGroupWithClasses);
            expect(db.query.classGroups.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [{ orgId: { isNull: true } }, { orgId }],
                },
                orderBy: expect.any(Function),
            });
        });

        it("returns global class groups when orgId is null", async () => {
            vi.mocked(db.query.classGroups.findMany).mockResolvedValue([
                { ...mockGroup, orgId: null },
            ]);
            vi.mocked(db.query.classGroupClasses.findMany).mockResolvedValue(
                []
            );

            const result =
                await classGroupsRepository.getClassGroupsForOrg(null);

            expect(result).toHaveLength(1);
            expect(db.query.classGroups.findMany).toHaveBeenCalledWith({
                where: {
                    orgId: { isNull: true },
                },
                orderBy: expect.any(Function),
            });
        });

        it("returns empty array when no groups found", async () => {
            vi.mocked(db.query.classGroups.findMany).mockResolvedValue([]);

            const result =
                await classGroupsRepository.getClassGroupsForOrg(orgId);

            expect(result).toEqual([]);
        });
    });

    describe("getClassGroup", () => {
        it("returns class group with class IDs", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                mockGroup
            );
            vi.mocked(db.query.classGroupClasses.findMany).mockResolvedValue([
                { classGroupId: "group-1", classId: "class-1" },
                { classGroupId: "group-1", classId: "class-2" },
            ]);

            const result = await classGroupsRepository.getClassGroup(
                "group-1",
                orgId
            );

            expect(result).toEqual(mockClassGroupWithClasses);
            expect(db.query.classGroups.findFirst).toHaveBeenCalledWith({
                where: {
                    classGroupId: "group-1",
                    OR: [{ orgId: { isNull: true } }, { orgId }],
                },
            });
        });

        it("returns null when group not found", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                undefined
            );

            const result = await classGroupsRepository.getClassGroup(
                "non-existent",
                orgId
            );

            expect(result).toBeNull();
        });
    });

    describe("getAvailableBaseClasses", () => {
        it("returns available base classes for org", async () => {
            const mockSelect = {
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        orderBy: vi.fn().mockResolvedValue([
                            {
                                classId: "class-1",
                                shortName: "SSM",
                                longName: "Super Street Modified",
                                orgId: orgId,
                            },
                            {
                                classId: "class-2",
                                shortName: "GS",
                                longName: "G Street",
                                orgId: null,
                            },
                        ]),
                    }),
                }),
            };
            vi.mocked(db.select).mockReturnValue(mockSelect as never);

            const result =
                await classGroupsRepository.getAvailableBaseClasses(orgId);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                classId: "class-1",
                shortName: "SSM",
                longName: "Super Street Modified",
                orgId: orgId,
            });
        });

        it("returns only global classes when orgId is null", async () => {
            const mockSelect = {
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        orderBy: vi.fn().mockResolvedValue([
                            {
                                classId: "class-2",
                                shortName: "GS",
                                longName: "G Street",
                                orgId: null,
                            },
                        ]),
                    }),
                }),
            };
            vi.mocked(db.select).mockReturnValue(mockSelect as never);

            const result =
                await classGroupsRepository.getAvailableBaseClasses(null);

            expect(result).toHaveLength(1);
        });
    });

    describe("createClassGroup", () => {
        it("creates class group successfully", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                undefined
            );
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([mockGroup]),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);
            vi.mocked(db.query.classGroups.findFirst)
                .mockResolvedValueOnce(undefined)
                .mockResolvedValueOnce(mockGroup);
            vi.mocked(db.query.classGroupClasses.findMany).mockResolvedValue([
                { classGroupId: "group-1", classId: "class-1" },
            ]);

            // Mock getAvailableBaseClasses
            const mockSelect = {
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        orderBy: vi.fn().mockResolvedValue([
                            {
                                classId: "class-1",
                                shortName: "SSM",
                                longName: "Super Street Modified",
                                orgId: orgId,
                            },
                        ]),
                    }),
                }),
            };
            vi.mocked(db.select).mockReturnValue(mockSelect as never);

            const result = await classGroupsRepository.createClassGroup({
                shortName: "SSM",
                longName: "Super Street Modified",
                orgId,
                classIds: ["class-1"],
            });

            expect(result).toBeDefined();
            expect(db.insert).toHaveBeenCalledWith(classGroups);
        });

        it("throws error when short name already exists", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                mockGroup
            );

            await expect(
                classGroupsRepository.createClassGroup({
                    shortName: "SSM",
                    longName: "Super Street Modified",
                    orgId,
                    classIds: [],
                })
            ).rejects.toThrow(
                "A class group with the short name 'SSM' already exists."
            );
        });

        it("throws error when invalid class IDs provided", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                undefined
            );
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([mockGroup]),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);

            // Mock getAvailableBaseClasses to return empty array
            const mockSelect = {
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        orderBy: vi.fn().mockResolvedValue([]),
                    }),
                }),
            };
            vi.mocked(db.select).mockReturnValue(mockSelect as never);

            // Mock delete for rollback
            const mockDelete = {
                where: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(db.delete).mockReturnValue(mockDelete as never);

            await expect(
                classGroupsRepository.createClassGroup({
                    shortName: "SSM",
                    longName: "Super Street Modified",
                    orgId,
                    classIds: ["invalid-class-id"],
                })
            ).rejects.toThrow("Invalid class IDs: invalid-class-id");
        });
    });

    describe("updateClassGroup", () => {
        it("updates class group successfully", async () => {
            vi.mocked(db.query.classGroups.findFirst)
                .mockResolvedValueOnce(mockGroup)
                .mockResolvedValueOnce(mockGroup);
            const mockUpdate = {
                set: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue(undefined),
                }),
            };
            vi.mocked(db.update).mockReturnValue(mockUpdate as never);
            const mockDelete = {
                where: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(db.delete).mockReturnValue(mockDelete as never);
            const mockInsert = {
                values: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);
            vi.mocked(db.query.classGroupClasses.findMany).mockResolvedValue([
                { classGroupId: "group-1", classId: "class-1" },
            ]);

            // Mock getAvailableBaseClasses
            const mockSelect = {
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        orderBy: vi.fn().mockResolvedValue([
                            {
                                classId: "class-1",
                                shortName: "SSM",
                                longName: "Super Street Modified",
                                orgId: orgId,
                            },
                        ]),
                    }),
                }),
            };
            vi.mocked(db.select).mockReturnValue(mockSelect as never);

            const result = await classGroupsRepository.updateClassGroup({
                classGroupId: "group-1",
                shortName: "UPDATED",
                longName: "Updated Name",
                isEnabled: true,
                classIds: ["class-1"],
            });

            expect(result).toBeDefined();
            expect(db.update).toHaveBeenCalledWith(classGroups);
        });

        it("throws error when group not found", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                undefined
            );

            await expect(
                classGroupsRepository.updateClassGroup({
                    classGroupId: "non-existent",
                    shortName: "SSM",
                    longName: "Super Street Modified",
                    isEnabled: true,
                    classIds: [],
                })
            ).rejects.toThrow("Class group not found");
        });

        it("throws error when short name conflicts", async () => {
            // First call: find existing group by classGroupId
            // Second call: check if conflict exists with same classGroupId (should return null)
            // Third call: check for other conflicts (should return conflicting group)
            vi.mocked(db.query.classGroups.findFirst)
                .mockResolvedValueOnce(mockGroup) // Find existing group
                .mockResolvedValueOnce(undefined) // No conflict with same ID
                .mockResolvedValueOnce({
                    ...mockGroup,
                    classGroupId: "other-group",
                    shortName: "CONFLICT",
                }); // Other conflict found

            await expect(
                classGroupsRepository.updateClassGroup({
                    classGroupId: "group-1",
                    shortName: "CONFLICT",
                    longName: "Conflict Name",
                    isEnabled: true,
                    classIds: [],
                })
            ).rejects.toThrow(
                "A class group with the short name 'CONFLICT' already exists."
            );
        });
    });

    describe("deleteClassGroup", () => {
        it("deletes class group successfully", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                mockGroup
            );
            const mockDelete = {
                where: vi.fn().mockResolvedValue(undefined),
            };
            vi.mocked(db.delete).mockReturnValue(mockDelete as never);

            await classGroupsRepository.deleteClassGroup("group-1", orgId);

            expect(db.delete).toHaveBeenCalledWith(classGroups);
            expect(mockDelete.where).toHaveBeenCalledWith(
                eq(classGroups.classGroupId, "group-1")
            );
        });

        it("throws error when group not found", async () => {
            vi.mocked(db.query.classGroups.findFirst).mockResolvedValue(
                undefined
            );

            await expect(
                classGroupsRepository.deleteClassGroup("non-existent", orgId)
            ).rejects.toThrow(
                "Class group not found or you don't have permission"
            );
        });
    });
});
