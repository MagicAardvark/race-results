import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    deleteUser,
    updateUserGlobalRoles,
    updateUserInformation,
} from "./user.actions";
import { userService } from "@/services/users/user.service";
import { mockAdminUser, createMockUser } from "@/__tests__/mocks/mock-users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { rolesService } from "@/services/roles/roles.service";

vi.mock("@/services/users/user.service");
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
        vi.mocked(userService.getCurrentUser).mockResolvedValue(mockAdminUser);
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
            vi.mocked(userService.getCurrentUser).mockResolvedValue(
                createMockUser({ roles: [] })
            );

            const result = await deleteUser("user-1");

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Unauthorized: Admin access required");
            expect(userService.deleteUser).not.toHaveBeenCalled();
        });

        it("prevents users from deleting their own account", async () => {
            const currentAdmin = createMockUser({
                userId: "admin-123",
                roles: ["admin"],
            });
            vi.mocked(userService.getCurrentUser).mockResolvedValue(
                currentAdmin
            );

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
                updateUserInformation({ isError: false, message: "" }, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUser).toHaveBeenCalledWith("user-1", {
                displayName: "John Doe",
            });
        });

        it("converts empty string to undefined", async () => {
            const formData = new FormData();
            formData.set("userId", "user-1");
            formData.set("displayName", "   ");

            await expect(
                updateUserInformation({ isError: false, message: "" }, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUser).toHaveBeenCalledWith("user-1", {
                displayName: undefined,
            });
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
                updateUserGlobalRoles({ isError: false, message: "" }, formData)
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
                updateUserGlobalRoles({ isError: false, message: "" }, formData)
            ).rejects.toThrow("redirect called");

            expect(userService.updateUserGlobalRoles).toHaveBeenCalledWith(
                "user-1",
                ["user"]
            );
        });
    });
});
