import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/ui/sidebar";
import { NavGroup } from "@/lib/shared/layout/configuration/navigation";
import { SidebarNavigation } from "./sidebar-navigation";
import { AppHeader } from "./app-header";
import { TenantProvider } from "@/context/TenantContext";
import { tenantService } from "@/services/tenants/tenant.service";

export async function ConfigurationLayout({
    navigationData,
    children,
}: {
    navigationData: NavGroup[];
    children: React.ReactNode;
}) {
    const tenant = await tenantService.getTenant();

    return (
        <TenantProvider tenant={tenant}>
            <SidebarProvider>
                <div className="flex min-h-screen flex-col w-full">
                    <AppHeader
                        sidebarTrigger={
                            <div className="md:hidden">
                                <SidebarTrigger className="-ml-1" />
                            </div>
                        }
                    />
                    <div className="flex flex-1">
                        <SidebarNavigation navItems={navigationData} />
                        <SidebarInset className="pt-0">
                            <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                                {children}
                            </main>
                        </SidebarInset>
                    </div>
                </div>
            </SidebarProvider>
        </TenantProvider>
    );
}
