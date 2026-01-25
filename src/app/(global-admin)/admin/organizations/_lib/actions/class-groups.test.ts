import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    createClassGroup,
    updateClassGroup,
    deleteClassGroup,
    getClassGroup,
} from "./class-groups";
import { classGroupsService } from "@/services/class-groups/class-groups.service";
import { requireOrgRole } from "@/lib/auth/require-org-role";
import { revalidatePath } from "next/cache";
import type { ClassGroupWithClasses } from "@/dto/class-groups";
import { ROLES } from "@/constants/global";

vi.mock("@/services/class-groups/class-groups.service");
vi.mock("@/lib/auth/require-org-role");
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

describe("class-groups actions", () => {
    const orgId = "test-org-id";
    // Use properly formatted UUIDs that pass Zod's .uuid() validation (UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    const validClassId1 = "550e8400-e29b-41d4-a716-446655440000";
    const validClassId2 = "660e8400-e29b-41d4-a716-446655440001";
    const validGroupId = "770e8400-e29b-41d4-a716-446655440002";
    const mockClassGroup: ClassGroupWithClasses = {
        classGroupId: validGroupId,
        shortName: "SSM",
        longName: "Super Street Modified",
        isEnabled: true,
        orgId: orgId,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        classIds: [validClassId1, validClassId2],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(requireOrgRole).mockResolvedValue({} as never);
    });

    describe("createClassGroup", () => {
        it("creates class group successfully", async () => {
            vi.mocked(classGroupsService.createClassGroup).mockResolvedValue(
                mockClassGroup
            );

            const result = await createClassGroup(orgId, {
                shortName: "SSM",
                longName: "Super Street Modified",
                classIds: [validClassId1, validClassId2],
            });

            expect(result.isError).toBe(false);
            if (!result.isError) {
                expect(result.message).toBe("Class group created successfully");
                expect(result.data).toEqual(mockClassGroup);
            }
            expect(requireOrgRole).toHaveBeenCalledWith(orgId, ROLES.orgOwner);
            expect(classGroupsService.createClassGroup).toHaveBeenCalledWith({
                shortName: "SSM",
                longName: "Super Street Modified",
                orgId,
                classIds: [validClassId1, validClassId2],
            });
            expect(revalidatePath).toHaveBeenCalledWith(
                "/admin/organizations",
                "layout"
            );
        });

        it("filters out invalid class IDs", async () => {
            vi.mocked(classGroupsService.createClassGroup).mockResolvedValue(
                mockClassGroup
            );

            const validUuid = "550e8400-e29b-41d4-a716-446655440000";
            const result = await createClassGroup(orgId, {
                shortName: "SSM",
                longName: "Super Street Modified",
                classIds: [
                    validUuid,
                    "invalid",
                    "",
                    null as unknown as string,
                    "not-a-uuid",
                ],
            });

            expect(result.isError).toBe(false);
            if (!result.isError) {
                expect(
                    classGroupsService.createClassGroup
                ).toHaveBeenCalledWith({
                    shortName: "SSM",
                    longName: "Super Street Modified",
                    orgId,
                    classIds: [validUuid],
                });
            }
        });

        it("returns error when validation fails", async () => {
            const result = await createClassGroup(orgId, {
                shortName: "",
                longName: "",
                classIds: [],
            });

            expect(result.isError).toBe(true);
            if (result.isError) {
                expect(result.errors).toBeDefined();
                const errors = Array.isArray(result.errors)
                    ? result.errors
                    : [result.errors];
                expect(errors.length).toBeGreaterThan(0);
            }
            expect(classGroupsService.createClassGroup).not.toHaveBeenCalled();
        });

        it("returns error when service throws", async () => {
            vi.mocked(classGroupsService.createClassGroup).mockRejectedValue(
                new Error("Service error")
            );

            const result = await createClassGroup(orgId, {
                shortName: "SSM",
                longName: "Super Street Modified",
                classIds: [],
            });

            expect(result.isError).toBe(true);
            if (result.isError) {
                const errors = Array.isArray(result.errors)
                    ? result.errors
                    : [result.errors];
                expect(errors).toEqual(["Service error"]);
            }
        });

        it("handles unknown errors", async () => {
            vi.mocked(classGroupsService.createClassGroup).mockRejectedValue(
                "Unknown error"
            );

            const result = await createClassGroup(orgId, {
                shortName: "SSM",
                longName: "Super Street Modified",
                classIds: [],
            });

            expect(result.isError).toBe(true);
            if (result.isError) {
                const errors = Array.isArray(result.errors)
                    ? result.errors
                    : [result.errors];
                expect(errors).toEqual(["An unknown error occurred"]);
            }
        });
    });

    describe("updateClassGroup", () => {
        it("updates class group successfully", async () => {
            const updatedGroup: ClassGroupWithClasses = {
                ...mockClassGroup,
                shortName: "UPDATED",
                longName: "Updated Name",
            };
            vi.mocked(classGroupsService.updateClassGroup).mockResolvedValue(
                updatedGroup
            );

            const result = await updateClassGroup(orgId, {
                classGroupId: validGroupId,
                shortName: "UPDATED",
                longName: "Updated Name",
                isEnabled: true,
                classIds: [validClassId1],
            });

            expect(result.isError).toBe(false);
            if (!result.isError) {
                expect(result.message).toBe("Class group updated successfully");
                expect(result.data).toEqual(updatedGroup);
            }
            expect(requireOrgRole).toHaveBeenCalledWith(orgId, ROLES.orgOwner);
            expect(classGroupsService.updateClassGroup).toHaveBeenCalledWith({
                classGroupId: validGroupId,
                shortName: "UPDATED",
                longName: "Updated Name",
                isEnabled: true,
                classIds: [validClassId1],
            });
            expect(revalidatePath).toHaveBeenCalledWith(
                "/admin/organizations",
                "layout"
            );
        });

        it("filters out invalid class IDs", async () => {
            vi.mocked(classGroupsService.updateClassGroup).mockResolvedValue(
                mockClassGroup
            );

            const validUuid = "550e8400-e29b-41d4-a716-446655440000";
            const result = await updateClassGroup(orgId, {
                classGroupId: validGroupId,
                shortName: "SSM",
                longName: "Super Street Modified",
                isEnabled: true,
                classIds: [validUuid, "invalid", "", null as unknown as string],
            });

            expect(result.isError).toBe(false);
            if (!result.isError) {
                expect(
                    classGroupsService.updateClassGroup
                ).toHaveBeenCalledWith({
                    classGroupId: validGroupId,
                    shortName: "SSM",
                    longName: "Super Street Modified",
                    isEnabled: true,
                    classIds: [validUuid],
                });
            }
        });

        it("returns error when validation fails", async () => {
            const result = await updateClassGroup(orgId, {
                classGroupId: "invalid-uuid",
                shortName: "",
                longName: "",
                isEnabled: true,
                classIds: [],
            });

            expect(result.isError).toBe(true);
            if (result.isError) {
                expect(result.errors).toBeDefined();
                const errors = Array.isArray(result.errors)
                    ? result.errors
                    : [result.errors];
                expect(errors.length).toBeGreaterThan(0);
            }
            expect(classGroupsService.updateClassGroup).not.toHaveBeenCalled();
        });

        it("returns error when service throws", async () => {
            vi.mocked(classGroupsService.updateClassGroup).mockRejectedValue(
                new Error("Service error")
            );

            const result = await updateClassGroup(orgId, {
                classGroupId: validGroupId,
                shortName: "SSM",
                longName: "Super Street Modified",
                isEnabled: true,
                classIds: [],
            });

            expect(result.isError).toBe(true);
            if (result.isError) {
                const errors = Array.isArray(result.errors)
                    ? result.errors
                    : [result.errors];
                expect(errors).toEqual(["Service error"]);
            }
        });
    });

    describe("deleteClassGroup", () => {
        it("deletes class group successfully", async () => {
            vi.mocked(classGroupsService.deleteClassGroup).mockResolvedValue(
                undefined
            );

            const result = await deleteClassGroup(orgId, validGroupId);

            expect(result.isError).toBe(false);
            if (!result.isError) {
                expect(result.message).toBe("Class group deleted successfully");
            }
            expect(requireOrgRole).toHaveBeenCalledWith(orgId, ROLES.orgOwner);
            expect(classGroupsService.deleteClassGroup).toHaveBeenCalledWith(
                validGroupId,
                orgId
            );
            expect(revalidatePath).toHaveBeenCalledWith(
                "/admin/organizations",
                "layout"
            );
        });

        it("returns error when service throws", async () => {
            vi.mocked(classGroupsService.deleteClassGroup).mockRejectedValue(
                new Error("Service error")
            );

            const result = await deleteClassGroup(orgId, validGroupId);

            expect(result.isError).toBe(true);
            if (result.isError) {
                const errors = Array.isArray(result.errors)
                    ? result.errors
                    : [result.errors];
                expect(errors).toEqual(["Service error"]);
            }
        });
    });

    describe("getClassGroup", () => {
        it("returns class group successfully", async () => {
            vi.mocked(classGroupsService.getClassGroup).mockResolvedValue(
                mockClassGroup
            );

            const result = await getClassGroup(orgId, validGroupId);

            expect(result).toEqual(mockClassGroup);
            expect(requireOrgRole).toHaveBeenCalledWith(orgId, ROLES.orgOwner);
            expect(classGroupsService.getClassGroup).toHaveBeenCalledWith(
                validGroupId,
                orgId
            );
        });

        it("returns null when class group not found", async () => {
            vi.mocked(classGroupsService.getClassGroup).mockResolvedValue(null);

            const result = await getClassGroup(orgId, "non-existent");

            expect(result).toBeNull();
        });
    });
});
