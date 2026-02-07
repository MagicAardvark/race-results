import {
    LiveResultsSnapshot,
    LiveResultsSnapshotSchema,
} from "@/dto/live-results/ingest";
import { eventCloseoutService } from "@/services/events/event-closeout.service";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    params: { params: Promise<{ orgSlug: string }> }
) {
    const { orgSlug } = await params.params;

    let data: LiveResultsSnapshot;

    try {
        data = LiveResultsSnapshotSchema.parse(await request.json());
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Invalid request body.",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 400 }
        );
    }

    try {
        await eventCloseoutService.closeEvent(orgSlug, data);
    } catch (error) {
        throw error;
        return Response.json({
            success: false,
            message: "Error closing out event.",
            status: 500,
        });
    }

    return Response.json({ success: true });
}
