import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    deleteUser,
    updateUserGlobalRoles,
    updateUserInformation,
} from "./user.actions";
import { INITIAL_ACTION_STATE } from "@/types/forms";
import { userService } from "@/services/users/user.service";
import {
    mockAdminUser,
    createMockUserWithExtendedDetails,
} from "@/__tests__/mocks/mock-users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { rolesService } from "@/services/roles/roles.service";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

vi.mock("@/services/users/user.service");
vi.mock("@/services/users/user.service.cached", () => ({
    getCurrentUserCached: vi.fn(),
}));
vi.mock("@/services/roles/roles.service");
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    redirect: vi.fn(() => {
        throw new Error("redirect called");
    }),
}));

describe("user.actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getCurrentUserCached).mockResolvedValue(mockAdminUser);
    });

    describe("deleteUser", () => {
        it("deletes user and redirects on success", async () => {
            vi.mocked(userService.deleteUser).mockResolvedValue(undefined);

            await expect(deleteUser("user-1")).rejects.toThrow(
                "redirect called"
            );

            expect(userService.deleteUser).toHaveBeenCalledWith("user-1");
            expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
            expect(redirect).toHaveBeenCalledWith("/admin/users");
        });

        it("prevents non-admin users from deleting accounts", async () => {
            vi.mocked(getCurrentUserCached).mockResolvedValue(
                createMockUserWithExtendedDetails({ roles: ["user"] })
            );

            await expect(deleteUser("user-1")).rejects.toThrow(
                "redirect called"
            );

            expect(userService.deleteUser).not.toHaveBeenCalled();
        });

        it("prevents users from deleting their own account", async () => {
            const currentAdmin = createMockUserWithExtendedDetails({
                userId: "admin-123",
                roles: ["admin"],
            });
            vi.mocked(getCurrentUserCached).mockResolvedValue(currentAdmin);

            const result = await deleteUser("admin-123");

            expect(result.isError).toBe(true);
            expect(result.message).toBe("You cannot delete your own account");
            expect(userService.deleteUser).not.toHaveBeenCalled();
        });

        it("handles service errors gracefully", async () => {
            vi.mocked(userService.deleteUser).mockRejectedValue(
                new Error("Database error")
            );

            const result = await deleteUser("user-1");

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Database error");
        });
    });

    describe("updateUserInformation", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.mocked(userService.updateUser).mockResolvedValue(undefined);
        });

        it("trims whitespace from display name", async () => {
            const formData = new FormData();
            formData.set("userId", "user-1");
            formData.set("displayName", "  John Doe  ");

            await expect(
                updateUserInformation(INITIAL_ACTION_STATE, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUser).toHaveBeenCalledWith("user-1", {
                displayName: "John Doe",
                firstName: null,
                lastName: null,
                email: null,
                motorsportregId: null,
            });
        });

        it("converts empty string to undefined for displayName", async () => {
            const formData = new FormData();
            formData.set("userId", "user-1");
            formData.set("displayName", "   ");

            await expect(
                updateUserInformation(INITIAL_ACTION_STATE, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUser).toHaveBeenCalledWith("user-1", {
                displayName: undefined,
                firstName: null,
                lastName: null,
                email: null,
                motorsportregId: null,
            });
        });

        it("passes firstName, lastName, email, motorsportregId to updateUser", async () => {
            const formData = new FormData();
            formData.set("userId", "user-1");
            formData.set("displayName", "Display");
            formData.set("firstName", "Jane");
            formData.set("lastName", "Smith");
            formData.set("email", "jane@example.com");
            formData.set("motorsportregId", "msr-123");

            await expect(
                updateUserInformation(INITIAL_ACTION_STATE, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUser).toHaveBeenCalledWith("user-1", {
                displayName: "Display",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                motorsportregId: "msr-123",
            });
        });

        it("trims new fields and converts empty strings to null", async () => {
            const formData = new FormData();
            formData.set("userId", "user-1");
            formData.set("firstName", "  Jane  ");
            formData.set("lastName", "  ");
            formData.set("email", "");
            formData.set("motorsportregId", "  msr-1  ");

            await expect(
                updateUserInformation(INITIAL_ACTION_STATE, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUser).toHaveBeenCalledWith("user-1", {
                displayName: undefined,
                firstName: "Jane",
                lastName: null,
                email: null,
                motorsportregId: "msr-1",
            });
        });

        it("returns error when userId is missing", async () => {
            const formData = new FormData();
            formData.set("displayName", "Test");

            const result = await updateUserInformation(
                INITIAL_ACTION_STATE,
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe("User ID is required");
            expect(userService.updateUser).not.toHaveBeenCalled();
        });
    });

    describe("updateUserGlobalRoles", () => {
        beforeEach(() => {
            vi.clearAllMocks();

            vi.mocked(rolesService.getGlobalRoles).mockResolvedValue([
                { roleId: "123", key: "user", name: "User" },
                { roleId: "124", key: "admin", name: "Admin" },
            ]);

            vi.mocked(userService.updateUserGlobalRoles).mockResolvedValue(
                undefined
            );
        });
        it("automatically adds user role if not selected", async () => {
            const formData = new FormData();
            formData.set("userId", "user-1");
            formData.set("role.admin", "on");
            // Note: 'user' role NOT checked

            await expect(
                updateUserGlobalRoles(INITIAL_ACTION_STATE, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUserGlobalRoles).toHaveBeenCalledWith(
                "user-1",
                ["admin", "user"] // 'user' was auto-added
            );
        });

        it("preserves user role when already selected", async () => {
            const formData = new FormData();
            formData.set("userId", "user-1");
            formData.set("role.user", "on");

            await expect(
                updateUserGlobalRoles(INITIAL_ACTION_STATE, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUserGlobalRoles).toHaveBeenCalledWith(
                "user-1",
                ["user"]
            );
        });
    });
});
