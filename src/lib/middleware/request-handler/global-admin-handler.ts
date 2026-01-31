import { IRequestHandler } from "@/lib/middleware/request-handler/request-handler";
import { NextRequest, NextResponse } from "next/server";

export class GlobalAdminHandler implements IRequestHandler {
    async handleRequest(_req: NextRequest): Promise<NextResponse> {
        return NextResponse.next();
    }
}

export const globalAdminHandler = new GlobalAdminHandler();
