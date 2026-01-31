import { NextRequest, NextResponse } from "next/server";

export interface IRequestHandler {
    handleRequest(req: NextRequest): Promise<NextResponse>;
}
