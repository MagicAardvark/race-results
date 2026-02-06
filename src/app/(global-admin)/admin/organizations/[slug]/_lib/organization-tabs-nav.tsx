"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

type OrganizationTabsNavProps = {
    orgSlug: string;
};

export function OrganizationTabsNav({ orgSlug }: OrganizationTabsNavProps) {
    const router = useRouter();
    const pathname = usePathname();

    const getCurrentTab = () => {
        if (pathname.includes("/event-setup")) return "event-setup";
        if (pathname.includes("/calendar")) return "calendar";
        if (pathname.includes("/settings")) return "settings";
        return "general";
    };

    const currentTab = getCurrentTab();

    const handleTabChange = (value: string) => {
        const basePath = `/admin/organizations/${orgSlug}`;
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
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="event-setup">Event Setup</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
