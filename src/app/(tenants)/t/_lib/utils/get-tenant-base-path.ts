import { HEADERS } from "@/constants/global";
import { headers } from "next/headers";
import { cache } from "react";

export const getTenantBasePath = cache(async (): Promise<string> => {
    const requestHeaders = await headers();

    return requestHeaders.get(HEADERS.TENANT.BASE_PATH) || "";
});
