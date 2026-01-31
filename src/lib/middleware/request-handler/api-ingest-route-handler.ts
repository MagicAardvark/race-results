import { HEADERS } from "@/constants/global";
import { IRequestHandler } from "@/lib/middleware/request-handler/request-handler";
import { organizationsAPIService } from "@/services/organizations/organizations.api.service";
import { NextRequest, NextResponse } from "next/server";

export class ApiIngestRouteHandler implements IRequestHandler {
    async handleRequest(req: NextRequest): Promise<NextResponse> {
        const apiKey = req.headers.get(HEADERS.API.INGEST_API_KEY);

        // Validate presence of API key
        if (!apiKey) {
            return NextResponse.json(
                { error: `Missing ${HEADERS.API.INGEST_API_KEY} header` },
                { status: 400 }
            );
        }

        const ingestRegex = /\/api\/ingest\/([^\/]+)\/(.*)/;

        const orgMatch = req.nextUrl.pathname.match(ingestRegex);

        // Validate presence of organization slug
        if (!orgMatch || orgMatch.length < 2) {
            return NextResponse.json(
                {
                    error: `Organization is missing`,
                },
                { status: 400 }
            );
        }

        const orgSlug = orgMatch[1];

        const isValid = await organizationsAPIService.validateApiRequest(
            orgSlug,
            apiKey
        );

        // Validate API key and organization slug
        if (!isValid) {
            return NextResponse.json(
                {
                    error: `Invalid ${HEADERS.API.INGEST_API_KEY} or organization`,
                },
                { status: 401 }
            );
        }

        return NextResponse.next();
    }
}

export const apiIngestRouteHandler = new ApiIngestRouteHandler();
