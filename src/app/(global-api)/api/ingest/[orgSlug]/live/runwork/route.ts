import { NextRequest, NextResponse } from "next/server";

export async function POST(
    _request: NextRequest,
    { params: _params }: { params: Promise<{ orgSlug: string }> }
) {
    // const { orgSlug } = await params;

    // TODO: Implement run/work ingestion logic

    return NextResponse.json(
        { message: "Not implemented yet" },
        { status: 501 }
    );
}
