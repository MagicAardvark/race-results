"use client";

import { ADMIN_ROLES } from "@/constants/global";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
    { value: "general", label: "General", allowedRoles: ADMIN_ROLES },
    { value: "settings", label: "Settings", allowedRoles: ADMIN_ROLES },
];

type ManagementTabsProps = {
    roles: Set<string>;
};

export function ManagementTabs({ roles }: ManagementTabsProps) {
    const router = useRouter();
    const pathname = usePathname();

    const getCurrentTab = () => {
        if (pathname.includes("/settings")) return "settings";
        return "general";
    };

    const currentTab = getCurrentTab();

    const handleTabChange = (value: string) => {
        const basePath = `/admin`;
        const newPath = value === "general" ? basePath : `${basePath}/${value}`;
        router.push(newPath);
    };

    return (
        <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
        >
            <TabsList>
                {tabs
                    .filter((tab) =>
                        tab.allowedRoles.some((role) => roles.has(role))
                    )
                    .map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
            </TabsList>
        </Tabs>
    );
}
