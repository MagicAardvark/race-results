import { IRequestHandler } from "@/lib/middleware/request-handler/request-handler";
import { NextRequest, NextResponse } from "next/server";

export class ApiGeneralRouteHandler implements IRequestHandler {
    async handleRequest(_req: NextRequest): Promise<NextResponse> {
        return NextResponse.next();
    }
}

export const apiGeneralRouteHandler = new ApiGeneralRouteHandler();
