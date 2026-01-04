import { CreateOrgDialog } from "@/app/(global-admin)/admin/components/organizations/create-org-dialog";
import { OrganizationEntry } from "@/app/(global-admin)/admin/components/organizations/organization-entry";
import { Button } from "@/ui/button-wrapper";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { PlusIcon } from "lucide-react";

export default async function Page() {
    const orgs = await organizationAdminService.getAll();

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Organizations</h1>
                <CreateOrgDialog
                    trigger={
                        <Button>
                            <PlusIcon />
                            Create Organization
                        </Button>
                    }
                />
            </div>
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orgs.map((org) => (
                        <OrganizationEntry key={org.orgId} org={org} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
