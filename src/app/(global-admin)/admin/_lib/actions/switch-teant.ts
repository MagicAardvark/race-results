// src/app/actions/user-preferences.ts
"use server";

import { cookies } from "next/headers";

export async function switchTenant(orgSlug: string) {
    const cookieStore = await cookies();
    cookieStore.set("rr-admin-tenant", orgSlug);
}
