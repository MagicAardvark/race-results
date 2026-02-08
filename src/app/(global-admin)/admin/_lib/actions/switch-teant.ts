"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function switchTenant(orgSlug: string) {
    const cookieStore = await cookies();
    cookieStore.set("rr-admin-tenant", orgSlug, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    });

    // Revalidate the entire admin section
    revalidatePath("/admin", "layout");
}
