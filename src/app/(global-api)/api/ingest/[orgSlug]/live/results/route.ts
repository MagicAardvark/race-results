import { HEADERS } from "@/constants/global";
import {
    LiveResultsSnapshot,
    LiveResultsSnapshotSchema,
} from "@/dto/live-results/ingest";
import { liveResultsService } from "@/services/live-results/live-results.service";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    params: { params: Promise<{ orgSlug: string }> }
) {
    const { orgSlug } = await params.params;
    const headerTimestamp = request.headers.get(HEADERS.API.INGEST_RESULTS_TS);

    if (!headerTimestamp) {
        return Response.json(
            {
                success: false,
                message: `Missing ${HEADERS.API.INGEST_RESULTS_TS} header.`,
            },
            { status: 400 }
        );
    }

    const timestamp = new Date(headerTimestamp);

    let data: LiveResultsSnapshot;

    try {
        data = LiveResultsSnapshotSchema.parse(await request.json());
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Invalid results snapshot.",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 400 }
        );
    }

    try {
        await liveResultsService.processAndUpdateCache(
            orgSlug,
            data,
            timestamp
        );
    } catch {
        return Response.json(
            { success: false, message: "Error processing live results data." },
            { status: 500 }
        );
    }

    return Response.json({ success: true });
}
