import { UpdateAllOrgs } from "@/app/(global-admin)/admin/(global)/public-calendar/_lib/components/update-all-orgs";
import { UpdateOrg } from "@/app/(global-admin)/admin/(global)/public-calendar/_lib/components/update-org";
import { Stack } from "@/app/components/shared/stack";
import { organizationService } from "@/services/organizations/organization.service";

export default async function Page() {
    const orgs = await organizationService.getAllOrganizations();

    return (
        <Stack>
            <p>
                This page is primarily intended for testing until scheduled
                tasks are implemented.
            </p>
            <UpdateAllOrgs />
            <UpdateOrg orgs={orgs} />
        </Stack>
    );
}
