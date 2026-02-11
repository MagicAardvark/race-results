"use server";

import { requireAdminAccess } from "@/lib/auth/require-admin-access";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function switchTenant(orgSlug: string) {
    const { user } = await requireAdminAccess();

    // Ensure the user has access to the selected organization
    if (user.orgs.every((o) => o.org.slug !== orgSlug)) {
        return;
    }

    const cookieStore = await cookies();

    cookieStore.set("rr-admin-tenant", orgSlug, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    });

    // Revalidate the entire admin section
    revalidatePath("/admin", "layout");
}
