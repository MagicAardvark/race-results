import { IRequestHandler } from "@/lib/middleware/request-handler/request-handler";
import { NextRequest, NextResponse } from "next/server";

export class InvalidRequestHandler implements IRequestHandler {
    async handleRequest(_req: NextRequest): Promise<NextResponse> {
        return new NextResponse("Invalid Request", {
            status: 400,
            headers: { "Content-Type": "text/plain" },
        });
    }
}

export const invalidRequestHandler = new InvalidRequestHandler();
