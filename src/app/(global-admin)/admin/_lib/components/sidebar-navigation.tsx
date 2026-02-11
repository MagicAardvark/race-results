"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/ui/sidebar";
import { NavGroup } from "@/lib/shared/layout/configuration/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { ChevronsUpDown, Earth, Plus } from "lucide-react";
import { OrgWithRoles } from "@/dto/users";
import { switchTenant } from "@/app/(global-admin)/admin/_lib/actions/switch-tenant";
import { CreateOrgDialog } from "@/app/(global-admin)/admin/_lib/components/organizations/create-org-dialog";
import { useState } from "react";
import { ROLES } from "@/constants/global";
import { useRouter } from "next/navigation";
import { Badge } from "@/ui/badge";
import { Spinner } from "@/ui/spinner";

export const SidebarNavigation = ({
    roles,
    navItems,
    organizations,
    currentOrg,
}: {
    roles: Set<string>;
    navItems: NavGroup[];
    organizations: OrgWithRoles[];
    currentOrg: { orgId: string; name: string; slug: string };
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);
    const [switchingOrg, setSwitchingOrg] = useState(false);

    const handleSelectOrg = async (orgSlug: string) => {
        setSwitchingOrg(true);
        await switchTenant(orgSlug);
        // Add a small delay to make the UI switch less jarring
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Force a navigation to the current path to refetch server component data
        router.replace(pathname);
        setSwitchingOrg(false);
    };

    return (
        <Sidebar>
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${switchingOrg ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
                <div className="fixed inset-0 z-55 flex items-center justify-center bg-white opacity-80"></div>
                <Badge className="z-60">
                    <Spinner data-icon="inline-start" />
                    <span>Switching Organization...</span>
                </Badge>
            </div>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <Earth className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {currentOrg.name}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    Organization
                                </DropdownMenuLabel>
                                {organizations.map((org) => (
                                    <DropdownMenuItem
                                        key={org.org.slug}
                                        onSelect={() =>
                                            handleSelectOrg(org.org.slug)
                                        }
                                    >
                                        {org.org.name}
                                    </DropdownMenuItem>
                                ))}
                                {roles.has(ROLES.admin) && (
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setOpen(false);
                                            setCreateOrgDialogOpen(true);
                                        }}
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                            <Plus className="size-4" />
                                        </div>
                                        <div className="text-muted-foreground font-medium">
                                            Create Organization
                                        </div>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {navItems
                    .filter((group) => group.show)
                    .map((group) => (
                        <SidebarGroup key={group.name}>
                            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items
                                        .filter((item) => item.show)
                                        .map((item) => (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    isActive={
                                                        pathname === item.href
                                                    }
                                                    asChild
                                                >
                                                    <Link
                                                        href={item.href}
                                                        className="w-full"
                                                    >
                                                        {item.text}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
            </SidebarContent>
            <CreateOrgDialog
                open={createOrgDialogOpen}
                setOpen={setCreateOrgDialogOpen}
            />
        </Sidebar>
    );
};
