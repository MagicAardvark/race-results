import { userService } from "@/services/users/user.service";
import { cache } from "react";

export const getCurrentUserCached = cache(async () => {
    return userService.getCurrentUser();
});

export const getUserByIdCached = cache(async (userId: string) => {
    return userService.getUserById(userId);
});
