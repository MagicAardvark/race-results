import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { organizationsAPIService } from "@/services/organizations/organizations.api.service";
import { NextRequest } from "next/server";
import z from "zod";

const AuthBodySchema = z.object({
    apiKey: z.string().min(1),
});

export async function POST(request: NextRequest, _params: unknown) {
    try {
        const postBody = AuthBodySchema.parse(await request.json());
        const apiKey = postBody.apiKey;

        const orgId = await organizationsAPIService.getOrgIdFromApiKey(apiKey);

        if (!orgId) {
            return Response.json(
                {
                    message: "Invalid API Key.",
                },
                { status: 401 }
            );
        }

        const org = await organizationAdminService.findById(orgId);

        if (!org) {
            return Response.json(
                {
                    message: "Organization not found.",
                },
                { status: 404 }
            );
        }

        const runWorkEnabled = await featureFlagsService.isFeatureEnabled(
            orgId,
            "feature.liveTiming.workRunEnabled"
        );

        const apis: Record<string, string> = {
            "live-timing": `api/ingest/${org.slug}/live/results`,
            "close-event": `api/ingest/${org.slug}/event/close`,
        };

        if (runWorkEnabled) {
            apis["run-work"] = `api/ingest/${org.slug}/live/runwork`;
        }

        return Response.json({
            org: {
                id: org.orgId,
                name: org.name,
                slug: org.slug,
                apis: apis,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json(
                {
                    message: "Invalid request body.",
                    error:
                        error instanceof Error ? error.message : String(error),
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                message: "Error processing request.",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
