import { filterNavForRoles } from "@/lib/shared/layout/configuration/navigation";
import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/ui/sidebar";
import { AppHeader } from "@/app/components/shared/layout/app-header";
import { SidebarNavigation } from "@/app/(global-admin)/admin/_lib/components/sidebar-navigation";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { switchTenant } from "@/app/(global-admin)/admin/_lib/actions/switch-teant";
import { ManagementTabs } from "@/app/(global-admin)/admin/_lib/components/organizations/tabs/management-tabs";

const ADMIN_NAVIGATION = [
    {
        name: "Config",
        items: [
            {
                text: "Users",
                href: "/admin/users",
                roles: [ROLES.admin],
            },
        ],
    },
    {
        name: "Classing",
        items: [
            {
                text: "Base Classes",
                href: "/admin/classes",
                roles: [ROLES.admin],
            },
        ],
    },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireRole(ROLES.admin);
    const orgs = user.orgs;

    const storedTenant = await getStoredTenant();

    if (!storedTenant || !orgs.some((org) => org.org.slug === storedTenant)) {
        const defaultOrg = orgs[0];
        await switchTenant(defaultOrg.org.slug);
    }

    const selectedOrg = storedTenant
        ? orgs.find((org) => org.org.slug === storedTenant) || orgs[0]
        : orgs[0];

    const navItems = filterNavForRoles(ADMIN_NAVIGATION, user.roles || []);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <AppHeader
                    sidebarTrigger={
                        <div className="md:hidden">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                    }
                />
                <div className="flex flex-1">
                    <SidebarNavigation
                        roles={user.roles || []}
                        navItems={navItems}
                        organizations={orgs}
                        selectedOrg={selectedOrg}
                    />
                    <SidebarInset className="pt-0">
                        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                            <ManagementTabs />
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    );
}
