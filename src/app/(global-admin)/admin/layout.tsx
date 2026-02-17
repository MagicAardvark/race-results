import { getNavigationConfiguration } from "@/lib/shared/layout/configuration/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/ui/sidebar";
import { AppHeader } from "@/app/components/shared/layout/app-header";
import { SavedToastHandler } from "@/app/(global-admin)/admin/_lib/components/saved-toast-handler";
import { SidebarNavigation } from "@/app/(global-admin)/admin/_lib/components/sidebar-navigation";
import { requireAdminAccess } from "@/lib/auth/require-admin-access";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, currentOrg, currentRoles } = await requireAdminAccess();

    const navItems = getNavigationConfiguration(user.roles);

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
                        roles={currentRoles}
                        navItems={navItems}
                        organizations={user.orgs}
                        currentOrg={currentOrg}
                    />
                    <SidebarInset className="pt-0">
                        <SavedToastHandler />
                        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    );
}
