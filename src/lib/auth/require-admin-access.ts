import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { ADMIN_ROLES, ROLES } from "@/constants/global";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { redirect } from "next/dist/client/components/navigation";

export async function requireAdminAccess() {
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

    const hasRole = user.roles.some((role) =>
        ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])
    );

    if (!hasRole) {
        redirect("/");
    }

    const currentRoles = selectedOrgWithRoles.roles.map((r) => r.key);

    return {
        user,
        currentOrg: selectedOrgWithRoles.org,
        // Include global admin role if user is a global admin
        currentRoles: new Set(
            [
                ...currentRoles,
                user.roles.includes(ROLES.admin) ? ROLES.admin : null,
            ].filter((r) => r !== null) as string[]
        ),
    };
}
