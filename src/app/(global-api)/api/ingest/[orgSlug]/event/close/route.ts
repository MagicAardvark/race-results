import { NextRequest } from "next/server";

export async function POST(_request: NextRequest, _params: unknown) {
    return Response.json({
        success: true,
        message: "Close event endpoint is operational.",
    });
}
