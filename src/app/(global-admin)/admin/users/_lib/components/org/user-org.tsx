import { AddOrgRoleButton } from "@/app/(global-admin)/admin/users/_lib/components/org/add-org-role-button";
import { DeleteOrgRoleButton } from "@/app/(global-admin)/admin/users/_lib/components/org/delete-org-role-button";
import { AvailableRole } from "@/dto/roles";
import { OrgWithRoles } from "@/dto/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";

type UserOrgProps = {
    userId: string;
    org: OrgWithRoles;
    roles: AvailableRole[];
};
export const UserOrg = ({ userId, org, roles }: UserOrgProps) => {
    return (
        <Card key={org.org.orgId} className="flex flex-col gap-4">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div>{org.org.name}</div>
                    <AddOrgRoleButton
                        userId={userId}
                        userOrg={org}
                        orgId={org.org.orgId}
                        orgName={org.org.name}
                        roles={roles}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {org.roles.map((role) => (
                            <TableRow key={role.roleId}>
                                <TableCell>{role.name}</TableCell>
                                <TableCell className="flex justify-end">
                                    <DeleteOrgRoleButton
                                        userId={userId}
                                        orgId={org.org.orgId}
                                        orgName={org.org.name}
                                        roleId={role.roleId}
                                        roleName={role.name}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
