import { AddOrgButton } from "@/app/(global-admin)/admin/users/_lib/components/org/add-org-button";
import { UserOrg } from "@/app/(global-admin)/admin/users/_lib/components/org/user-org";
import { Organization } from "@/dto/organizations";
import { AvailableRole } from "@/dto/roles";
import { UserWithExtendedDetails } from "@/dto/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

type UserOrgsProps = {
    user: UserWithExtendedDetails;
    orgs: Organization[];
    availableRoles: AvailableRole[];
};

export const UserOrgs = ({ user, orgs, availableRoles }: UserOrgsProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div>Organizations</div>
                    {user.orgs.length > 0 && (
                        <AddOrgButton orgs={orgs} user={user} />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {user.orgs.length === 0 ? (
                    <div className="flex flex-col gap-4">
                        <p>This user is not a member of any organizations.</p>
                        <div>
                            <AddOrgButton orgs={orgs} user={user} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {user.orgs.map((org) => (
                            <UserOrg
                                userId={user.userId}
                                org={org}
                                roles={availableRoles}
                                key={org.org.orgId}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
