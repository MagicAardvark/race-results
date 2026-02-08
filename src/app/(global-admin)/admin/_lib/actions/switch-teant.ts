"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function switchTenant(orgSlug: string) {
    const cookieStore = await cookies();
    cookieStore.set("rr-admin-tenant", orgSlug);

    revalidatePath("/admin", "page");
}
