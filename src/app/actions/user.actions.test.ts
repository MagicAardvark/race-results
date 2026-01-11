import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteUser } from "./user.actions";
import { userService } from "@/services/users/user.service";
import { mockAdminUser, createMockUser } from "@/__tests__/mocks/mock-users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

vi.mock("@/services/users/user.service");
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
    });

    describe("deleteUser", () => {
        beforeEach(() => {
            vi.mocked(userService.getCurrentUser).mockResolvedValue(
                mockAdminUser
            );
        });

        it("deletes user successfully", async () => {
            vi.mocked(userService.deleteUser).mockResolvedValue(undefined);

            await expect(deleteUser("user-1")).rejects.toThrow(
                "redirect called"
            );

            expect(userService.deleteUser).toHaveBeenCalledWith("user-1");
            expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
            expect(redirect).toHaveBeenCalledWith("/admin/users");
        });

        it("returns error when user is not admin", async () => {
            vi.mocked(userService.getCurrentUser).mockResolvedValue(
                createMockUser({ roles: [] })
            );

            const result = await deleteUser("user-1");

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Unauthorized: Admin access required");
            expect(userService.deleteUser).not.toHaveBeenCalled();
        });

        it("returns error when trying to delete yourself", async () => {
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

        it("returns error when service throws", async () => {
            vi.mocked(userService.deleteUser).mockRejectedValue(
                new Error("Database error")
            );

            const result = await deleteUser("user-1");

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Database error");
        });

        it("returns error when current user is null", async () => {
            vi.mocked(userService.getCurrentUser).mockResolvedValue(null);

            const result = await deleteUser("user-1");

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Unauthorized: Admin access required");
            expect(userService.deleteUser).not.toHaveBeenCalled();
        });
    });
});
