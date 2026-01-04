import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    _: { params: Promise<{ orgSlug: string }> }
) {
    const data = await request.json();

    return Response.json({ success: true, data: data });
}
