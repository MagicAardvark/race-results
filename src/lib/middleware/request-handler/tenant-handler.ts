import { HEADERS } from "@/constants/global";
import { IRequestHandler } from "@/lib/middleware/request-handler/request-handler";
import { extractTenant } from "@/lib/middleware/utils";
import { tenantService } from "@/services/tenants/tenant.service";
import { NextRequest, NextResponse } from "next/server";

export class TenantHandler implements IRequestHandler {
    async handleRequest(req: NextRequest): Promise<NextResponse> {
        const result = extractTenant(req);

        if (result.type !== "TENANT") {
            return this.invalidTenantResponse(req);
        }

        const tenant = result.tenant;

        const isValid = await tenantService.isValidTenant(tenant);

        if (!isValid) {
            return this.invalidTenantResponse(req);
        }

        let res: NextResponse;

        if (req.nextUrl.pathname.startsWith(`/t/${tenant}`)) {
            res = NextResponse.next();
        } else {
            res = NextResponse.rewrite(
                new URL(`/t/${tenant}${req.nextUrl.pathname}`, req.url)
            );
        }

        const tenantBase = result.basePath;

        res.headers.set(HEADERS.TENANT.SLUG, tenant);
        res.headers.set(HEADERS.TENANT.BASE_PATH, tenantBase);

        return res;
    }

    private invalidTenantResponse(req: NextRequest) {
        const url = req.nextUrl;
        url.pathname = "/tenant-not-found";
        return NextResponse.rewrite(url);
    }
}

export const tenantHandler = new TenantHandler();
