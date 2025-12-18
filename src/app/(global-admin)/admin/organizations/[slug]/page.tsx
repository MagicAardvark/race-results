import { ManageOrgDialog } from "@/components/admin/organizations/manage-org";
import { Button } from "@/components/button/button";
import { LinkButton } from "@/components/link-button/link-button";
import { organizationService } from "@/services/organizations/organization.service";
import { ArrowLeft, PencilIcon } from "lucide-react";

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
                    <div className="flex gap-2">
                        <h2>{org.name}</h2>
                        <ManageOrgDialog
                            org={org}
                            trigger={
                                <Button variant={"ghost"}>
                                    <PencilIcon />
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
