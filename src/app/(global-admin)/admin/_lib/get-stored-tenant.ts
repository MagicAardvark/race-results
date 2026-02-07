import { cookies } from "next/headers";

export async function getStoredTenant() {
    const cookiesStore = await cookies();
    const tenant = cookiesStore.get("rr-admin-tenant")?.value;

    if (!tenant) {
        throw new Error("No tenant found in cookies");
    }

    return tenant;
}
