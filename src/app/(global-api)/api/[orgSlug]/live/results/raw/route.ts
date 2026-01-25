import { liveResultsService } from "@/services/live-results/live-results.service";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ orgSlug: string }> }
) {
    const { orgSlug } = await params;

    const rawResults = await liveResultsService.getRawResults(orgSlug);

    if (!rawResults) {
        return Response.json(
            { success: false, message: "No cached raw results found." },
            { status: 404 }
        );
    }

    return Response.json(rawResults);
}
