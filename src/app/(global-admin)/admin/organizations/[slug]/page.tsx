import { LinkButton } from "@/components/link-button/link-button";
import { organizationService } from "@/services/organizations/organization.service";
import { ArrowLeft } from "lucide-react";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const org = await organizationService.getOrganizationBySlug(slug);

    return (
        <div>
            <LinkButton href="/admin/organizations">
                <ArrowLeft />
                Go Back
            </LinkButton>
            <div className="flex flex-col gap-4 mt-4">
                {org === null ? (
                    <p>Organization not found</p>
                ) : (
                    <div>
                        <h2>{org.name}</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
