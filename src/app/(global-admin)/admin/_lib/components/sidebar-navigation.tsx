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

export const SidebarNavigation = ({
    roles,
    navItems,
    organizations,
    selectedOrg,
}: {
    roles: string[];
    navItems: NavGroup[];
    organizations: OrgWithRoles[];
    selectedOrg: OrgWithRoles | null;
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);

    const handleSelectOrg = async (orgSlug: string) => {
        await switchTenant(orgSlug);
        // Force a navigation to the current path to refetch server component data
        router.replace(pathname);
    };

    return (
        <Sidebar>
            {selectedOrg && (
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
                                                {selectedOrg.org.name}
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
                                    {roles.includes(ROLES.admin) && (
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
            )}
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
