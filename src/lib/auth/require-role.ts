import { ROLES } from "@/constants/global";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { redirect } from "next/navigation";

export async function requireRole(role: keyof typeof ROLES) {
    const user = await getCurrentUserCached();

    if (!user) {
        redirect("/");
    }

    if (!user.roles.includes(role)) {
        redirect("/");
    }

    return user;
}
