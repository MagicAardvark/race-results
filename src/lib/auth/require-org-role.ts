import { ROLES } from "@/constants/global";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { redirect } from "next/navigation";

export async function requireOrgRole(
    orgId: string,
    role: (typeof ROLES)["orgOwner"] | (typeof ROLES)["orgManager"]
) {
    const user = await getCurrentUserCached();

    if (!user) {
        redirect("/");
    }

    // Global admins have access to all orgs
    if (user.roles.includes(ROLES.admin)) {
        return user;
    }

    // Check if user has the required role for this org
    const userOrg = user.orgs.find((o) => o.org.orgId === orgId);

    if (!userOrg) {
        redirect("/");
    }

    const hasRole = userOrg.roles.some((r) => r.key === role);

    if (!hasRole) {
        redirect("/");
    }

    return user;
}
