import { getNavigationConfiguration } from "@/lib/shared/layout/configuration/navigation";
import { ROLES } from "@/constants/global";
import { requireAnyRole } from "@/lib/auth/require-role";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/ui/sidebar";
import { AppHeader } from "@/app/components/shared/layout/app-header";
import { SidebarNavigation } from "@/app/(global-admin)/admin/_lib/components/sidebar-navigation";
import { getStoredTenant } from "@/app/(global-admin)/admin/_lib/get-stored-tenant";
import { InvalidOrg } from "@/app/(global-admin)/admin/_lib/components/organizations/invalid-org";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireAnyRole([
        ROLES.admin,
        ROLES.orgManager,
        ROLES.orgOwner,
    ]);

    const orgs = user.orgs;

    const storedTenant = await getStoredTenant();

    const matchedOrg = storedTenant
        ? orgs.find((org) => org.org.slug === storedTenant)
        : null;
    const isValidTenantSelected = !!matchedOrg;

    const selectedOrg = matchedOrg ?? null;

    console.log(selectedOrg);

    const navItems = getNavigationConfiguration(user.roles || []);

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
                            {isValidTenantSelected && <>{children}</>}
                            {!isValidTenantSelected && (
                                <InvalidOrg orgs={orgs} />
                            )}
                        </main>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    );
}
