import { cookies } from "next/headers";

export async function getStoredTenant() {
    const cookiesStore = await cookies();
    return cookiesStore.get("rr-admin-tenant")?.value ?? null;
}
