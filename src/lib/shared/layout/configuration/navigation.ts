import { ROLES } from "@/constants/global";

export type NavItem = {
    text: string;
    href: string;
    roles: string[];
    show: boolean;
};

export type NavGroup = {
    name: string;
    items: NavItem[];
    show: boolean;
};

const ADMIN_NAVIGATION = [
    {
        name: "Management",
        items: [
            {
                text: "Organization",
                href: "/admin",
                roles: [ROLES.admin, ROLES.orgManager, ROLES.orgOwner],
            },
            {
                text: "Event Setup",
                href: "/admin/event-setup",
                roles: [ROLES.admin, ROLES.orgManager, ROLES.orgOwner],
            },
            {
                text: "Calendar",
                href: "/admin/calendar",
                roles: [ROLES.admin, ROLES.orgManager, ROLES.orgOwner],
            },
        ],
    },
    {
        name: "Config",
        items: [
            {
                text: "Users",
                href: "/admin/users",
                roles: [ROLES.admin],
            },
        ],
    },
    {
        name: "Classing",
        items: [
            {
                text: "Base Classes",
                href: "/admin/classes",
                roles: [ROLES.admin],
            },
        ],
    },
];

export const getNavigationConfiguration = (roles: string[]): NavGroup[] => {
    return ADMIN_NAVIGATION.map((group) => {
        const groupItems = group.items.map((item) => ({
            ...item,
            show: item.roles.some((role) => roles.includes(role)),
        }));
        return {
            ...group,
            items: groupItems,
            show: groupItems.some((item) => item.show),
        };
    });
};
