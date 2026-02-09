import { ROLES } from "@/constants/global";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

export async function hasRole(
    role: (typeof ROLES)[keyof typeof ROLES]
): Promise<boolean> {
    const user = await getCurrentUserCached();

    if (!user) {
        return false;
    }

    if (!user.roles.includes(role)) {
        return false;
    }

    return true;
}

export async function hasAnyRole(
    roles: (typeof ROLES)[keyof typeof ROLES][]
): Promise<boolean> {
    const user = await getCurrentUserCached();

    if (!user) {
        return false;
    }

    const hasRole = roles.some((role) => user.roles.includes(role));

    if (!hasRole) {
        return false;
    }

    return true;
}
