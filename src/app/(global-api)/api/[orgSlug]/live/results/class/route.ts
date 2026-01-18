import { liveResultsService } from "@/services/live-results/live-results.service";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ orgSlug: string }> }
) {
    const { orgSlug } = await params;

    const classResults = liveResultsService.getClassResults(orgSlug);

    if (!classResults) {
        return Response.json(
            { success: false, message: "No cached class results found." },
            { status: 404 }
        );
    }

    return Response.json(classResults);
}
