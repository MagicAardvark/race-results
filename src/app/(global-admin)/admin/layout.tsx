import { ConfigurationLayout } from "@/app/components/shared/layout/configuration-layout";
import { filterNavForRoles } from "@/lib/shared/layout/configuration/navigation";
import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";

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
    const user = await requireRole(ROLES.admin);

    const navItems = filterNavForRoles(ADMIN_NAVIGATION, user.roles || []);

    return (
        <ConfigurationLayout navigationData={navItems}>
            {children}
        </ConfigurationLayout>
    );
}
