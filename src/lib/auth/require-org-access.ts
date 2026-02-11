import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { ORG_ROLES, ROLES } from "@/constants/global";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { redirect } from "next/dist/client/components/navigation";

export async function requireOrgAccess() {
    const user = await getCurrentUserCached();

    if (!user) {
        redirect("/");
    }

    const storedTenant = await getStoredTenant();

    if (user.orgs.length === 0) {
        redirect("/");
    }

    // Check if user has the required role for this org
    const selectedOrgWithRoles =
        user.orgs.find((o) => o.org.slug === storedTenant) ?? user.orgs[0];

    if (!selectedOrgWithRoles) {
        redirect("/");
    }

    const hasRole = selectedOrgWithRoles.roles.some((role) =>
        ORG_ROLES.includes(role.key as (typeof ORG_ROLES)[number])
    );
    const isAdmin = user.roles.includes(ROLES.admin);

    if (!isAdmin && !hasRole) {
        redirect("/");
    }

    const currentRoles = selectedOrgWithRoles.roles.map((r) => r.key);

    return {
        user,
        currentOrg: selectedOrgWithRoles.org,
        currentRoles: new Set(
            [
                ...currentRoles,
                user.roles.includes(ROLES.admin) ? ROLES.admin : null,
            ].filter((r) => r !== null) as string[]
        ),
    };
}
