import { liveResultsService } from "@/services/live-results/live-results.service";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ orgSlug: string }> }
) {
    const { orgSlug } = await params;

    const indexResults = liveResultsService.getIndexedResults(orgSlug);

    if (!indexResults) {
        return Response.json(
            { success: false, message: "No cached indexed results found." },
            { status: 404 }
        );
    }

    return Response.json(indexResults);
}
