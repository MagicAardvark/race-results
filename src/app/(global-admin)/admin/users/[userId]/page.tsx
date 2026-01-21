import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/ui/empty";
import { LinkButton } from "@/ui/link-button";
import { userService } from "@/services/users/user.service";
import { TriangleAlert } from "lucide-react";
import { rolesService } from "@/services/roles/roles.service";
import { organizationService } from "@/services/organizations/organization.service";
import { UserOrganizations } from "@/app/(global-admin)/admin/users/_lib/components/org/user-organizations";
import { GlobalRoles } from "@/app/(global-admin)/admin/users/_lib/components/roles/global-roles";
import { UserInfoForm } from "@/app/(global-admin)/admin/users/_lib/components/user-info-form";
import { DeleteUserButton } from "@/app/(global-admin)/admin/users/_lib/components/delete-user-button";

export default async function Page({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;
    const user = await userService.getUserById(userId);

    if (user === null) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <TriangleAlert />
                    </EmptyMedia>
                    <EmptyTitle>User Not Found</EmptyTitle>
                    <EmptyDescription>
                        The user you are looking for does not exist.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <LinkButton href="/admin/users">Go Back</LinkButton>
                </EmptyContent>
            </Empty>
        );
    }

    const roles = await rolesService.getGlobalRoles();
    const userOrgs = await userService.getUserOrgsWithPermissions(user.userId);
    const orgs = await organizationService.getAllOrganizations();

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    {user.displayName || "User"}
                </h1>
                <div className="flex items-center gap-2">
                    <DeleteUserButton
                        userId={user.userId}
                        userName={user.displayName}
                    />
                    <LinkButton href="/admin/users">Go Back</LinkButton>
                </div>
            </div>
            <UserInfoForm user={user} />
            <GlobalRoles user={user} availableRoles={roles} />
            <UserOrganizations
                user={user}
                userOrgs={userOrgs}
                organizations={orgs}
            />
        </div>
    );
}
