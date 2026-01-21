import { OrgWithRoles, User } from "@/dto/users";

type UserOrgProps = {
    user: User;
    orgWithRoles: OrgWithRoles;
};
export const UserOrg = ({ orgWithRoles }: UserOrgProps) => {
    return (
        <div key={orgWithRoles.org.orgId} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{orgWithRoles.org.name}</h3>
            {orgWithRoles.roles.map((role) => (
                <div key={role.roleId}>{role.name}</div>
            ))}
        </div>
    );
};
