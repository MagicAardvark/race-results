"use server";

import { userService } from "@/services/users/user.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { rolesService } from "@/services/roles/roles.service";
import { ROLES } from "@/constants/global";

type ActionState = {
    isError: boolean;
    message: string;
};

export async function updateUserInformation(
    _: ActionState,
    formData: FormData
): Promise<ActionState> {
    const userId = formData.get("userId")?.toString();
    const displayNameInput = formData.get("displayName")?.toString().trim();
    const displayName = displayNameInput || undefined;

    if (!userId) {
        return { isError: true, message: "User ID is required" };
    }

    // Verify user has admin permissions
    const currentUser = await userService.getCurrentUser();
    if (!currentUser?.roles.includes(ROLES.admin)) {
        return {
            isError: true,
            message: "Unauthorized: Admin access required",
        };
    }

    try {
        await userService.updateUser(userId, {
            displayName,
        });
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    revalidatePath("/admin/users");
    redirect(`/admin/users/${userId}`);
}

export async function updateUserGlobalRoles(
    _: ActionState,
    formData: FormData
): Promise<ActionState> {
    const userId = formData.get("userId")?.toString();

    if (!userId) {
        return { isError: true, message: "User ID is required" };
    }

    // Get selected roles from form data
    const globalRoles = await rolesService.getGlobalRoles();
    const selectedRoles = globalRoles
        .map((role) => {
            const isChecked = formData.get(`role.${role.key}`) === "on";
            return isChecked ? role.key : null;
        })
        .filter((key): key is string => key !== null);

    // Ensure at least 'user' role is assigned
    if (!selectedRoles.includes(ROLES.user)) {
        selectedRoles.push("user");
    }

    try {
        await userService.updateUserGlobalRoles(userId, selectedRoles);
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    revalidatePath("/admin/users");
    redirect(`/admin/users/${userId}`);
}

export async function deleteUser(userId: string): Promise<ActionState> {
    // Verify user has admin permissions
    const currentUser = await userService.getCurrentUser();
    if (!currentUser?.roles.includes(ROLES.admin)) {
        return {
            isError: true,
            message: "Unauthorized: Admin access required",
        };
    }

    // Prevent deleting yourself
    if (currentUser.userId === userId) {
        return {
            isError: true,
            message: "You cannot delete your own account",
        };
    }

    try {
        await userService.deleteUser(userId);
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }

    revalidatePath("/admin/users");
    redirect("/admin/users");
}
