import { ConfigurationLayout } from "@/app/components/shared/layout/configuration-layout";
import { userService } from "@/services/users/user.service";
import { filterNavForRoles } from "@/lib/shared/layout/configuration/navigation";
import { redirect } from "next/navigation";
import { ROLES } from "@/constants/global";

const ADMIN_NAVIGATION = [
    {
        name: "Config",
        items: [
            {
                text: "Organizations",
                href: "/admin/organizations",
                roles: [ROLES.admin],
            },
            {
                text: "Users",
                href: "/admin/users",
                roles: [ROLES.admin],
            },
        ],
    },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await userService.getCurrentUser();

    if (!user?.roles.some((r) => r === ROLES.admin)) {
        redirect("/");
    }

    const navItems = filterNavForRoles(ADMIN_NAVIGATION, user?.roles || []);

    return (
        <ConfigurationLayout navigationData={navItems}>
            {children}
        </ConfigurationLayout>
    );
}
