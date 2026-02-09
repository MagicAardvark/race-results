import { ROLES } from "@/constants/global";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { redirect } from "next/navigation";

export async function requireRole(role: (typeof ROLES)[keyof typeof ROLES]) {
    const user = await getCurrentUserCached();

    if (!user) {
        redirect("/");
    }

    if (!user.roles.includes(role)) {
        redirect("/");
    }

    return user;
}

export async function requireAnyRole(
    roles: (typeof ROLES)[keyof typeof ROLES][]
) {
    const user = await getCurrentUserCached();

    if (!user) {
        redirect("/");
    }

    const hasRole = roles.some((role) => user.roles.includes(role));

    if (!hasRole) {
        redirect("/");
    }

    return user;
}
