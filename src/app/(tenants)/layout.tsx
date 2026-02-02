import { TenantProvider } from "@/context/TenantContext";
import { tenantService } from "@/services/tenants/tenant.service";
import { AppHeader } from "@/app/components/shared/layout/app-header";

export default async function TenantsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const org = await tenantService.getTenant();

    return (
        <TenantProvider org={org}>
            <div className="flex min-h-screen flex-col">
                <AppHeader />
                <main className="flex-1">{children}</main>
            </div>
        </TenantProvider>
    );
}
