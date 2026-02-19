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
import { ProfileIconImage } from "@/app/components/profile-icon-image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
import { Loading } from "@/app/components/shared/loading";

export const SidebarNavigation = ({
    roles,
    navItems,
    organizations,
    currentOrg,
}: {
    roles: Set<string>;
    navItems: NavGroup[];
    organizations: OrgWithRoles[];
    currentOrg: {
        orgId: string;
        name: string;
        slug: string;
        profileIconUrl: string | null;
    };
}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);
    const [switchingOrg, setSwitchingOrg] = useState(false);

    const handleSelectOrg = async (orgSlug: string) => {
        setSwitchingOrg(true);
        await switchTenant(orgSlug);
        // Add a small delay to make the UI switch less jarring
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSwitchingOrg(false);

        const query = searchParams.toString();
        const nextUrl = query ? `${pathname}?${query}` : pathname;
        // Force a full reload to ensure server data is fetched with the new tenant
        window.location.assign(nextUrl);
    };

    return (
        <Sidebar>
            <Loading
                loading={switchingOrg}
                message="Switching organization..."
            />
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground relative flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                                        {currentOrg.profileIconUrl ? (
                                            <ProfileIconImage
                                                src={currentOrg.profileIconUrl}
                                                alt=""
                                                className="size-8 overflow-hidden rounded-lg"
                                            />
                                        ) : (
                                            <Earth className="size-4" />
                                        )}
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
                                        <div className="bg-sidebar-primary text-sidebar-primary-foreground relative flex aspect-square size-6 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                            {org.org.profileIconUrl ? (
                                                <ProfileIconImage
                                                    src={org.org.profileIconUrl}
                                                    alt=""
                                                    className="size-6 overflow-hidden rounded-md"
                                                />
                                            ) : (
                                                <Earth className="size-3" />
                                            )}
                                        </div>
                                        <span className="ml-2">
                                            {org.org.name}
                                        </span>
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
