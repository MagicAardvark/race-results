import { LinkButton } from "@/components/link-button/link-button";
import { TableCell, TableRow } from "@/components/library/ui/table";
import { OrganizationExtended } from "@/dto/organizations";
import { PencilIcon } from "lucide-react";

export const OrganizationEntry = ({ org }: { org: OrganizationExtended }) => {
    return (
        <TableRow key={org.orgId}>
            <TableCell>{org.name}</TableCell>
            <TableCell className="flex justify-end">
                <LinkButton
                    variant={"outline"}
                    href={`/admin/organizations/${org.slug}`}
                >
                    <PencilIcon />
                </LinkButton>
            </TableCell>
        </TableRow>
    );
};
