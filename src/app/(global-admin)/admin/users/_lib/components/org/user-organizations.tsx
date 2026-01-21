import { AddUserOrgButton } from "@/app/(global-admin)/admin/users/_lib/components/org/add-user-org-button";
import { UserOrg } from "@/app/(global-admin)/admin/users/_lib/components/org/user-org";
import { Organization } from "@/dto/organizations";
import { OrgWithRoles, User } from "@/dto/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

type UserOrganizationsProps = {
    user: User;
    userOrgs: OrgWithRoles[];
    organizations: Organization[];
};

export const UserOrganizations = ({
    user,
    userOrgs,
    organizations,
}: UserOrganizationsProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div>Organizations</div>
                    {userOrgs.length > 0 && (
                        <AddUserOrgButton
                            organizations={organizations}
                            user={user}
                        />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {userOrgs.length === 0 ? (
                    <div className="flex flex-col gap-4">
                        <p>This user is not a member of any organizations.</p>
                        <div>
                            <AddUserOrgButton
                                organizations={organizations}
                                user={user}
                            />
                        </div>
                    </div>
                ) : (
                    userOrgs.map((orgWithRoles) => (
                        <UserOrg
                            user={user}
                            orgWithRoles={orgWithRoles}
                            key={orgWithRoles.org.orgId}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
};
