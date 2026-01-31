import { HEADERS } from "@/constants/global";
import { IRequestHandler } from "@/lib/middleware/request-handler/request-handler";
import { extractTenant } from "@/lib/middleware/utils";
import { tenantService } from "@/services/tenants/tenant.service";
import { NextRequest, NextResponse } from "next/server";

export class TenantHandler implements IRequestHandler {
    async handleRequest(req: NextRequest): Promise<NextResponse> {
        const { tenant, type } = extractTenant(req);

        if (!tenant || type !== "TENANT") {
            return this.invalidTenantResponse(req);
        }

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

        res.headers.set(HEADERS.TENANT_SLUG, tenant);

        return res;
    }

    private invalidTenantResponse(req: NextRequest) {
        const url = req.nextUrl;
        url.pathname = "/tenant-not-found";
        return NextResponse.rewrite(url);
    }
}

export const tenantHandler = new TenantHandler();
