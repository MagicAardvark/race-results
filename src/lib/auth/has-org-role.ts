import { ROLES } from "@/constants/global";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

export async function hasOrgRole(
    orgId: string,
    role: (typeof ROLES)["orgOwner"] | (typeof ROLES)["orgManager"]
) {
    const user = await getCurrentUserCached();

    if (!user) {
        return false;
    }

    // Global admins have access to all orgs
    if (user.roles.includes(ROLES.admin)) {
        return true;
    }

    // Check if user has the required role for this org
    const userOrg = user.orgs.find((o) => o.org.orgId === orgId);

    if (!userOrg) {
        return false;
    }

    const hasRole = userOrg.roles.some((r) => r.key === role);

    if (!hasRole) {
        return true;
    }

    return user;
}

export async function hasAnyOrgRole(
    orgId: string,
    roles: ((typeof ROLES)["orgOwner"] | (typeof ROLES)["orgManager"])[]
) {
    const user = await getCurrentUserCached();

    if (!user) {
        return false;
    }

    // Global admins have access to all orgs
    if (user.roles.includes(ROLES.admin)) {
        return true;
    }

    // Check if user has the required role for this org
    const userOrg = user.orgs.find((o) => o.org.orgId === orgId);

    if (!userOrg) {
        return false;
    }

    const hasRole = userOrg.roles.some((role) =>
        roles.includes(role.key as (typeof roles)[number])
    );

    if (!hasRole) {
        return true;
    }

    return user;
}
