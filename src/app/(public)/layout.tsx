import { userService } from "@/services/users/user.service";
import { ROLES } from "@/dto/users";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/library/ui/separator";
import { Button } from "@/components/library/ui/button";
import { TenantProvider } from "@/context/TenantContext";
import { tenantService } from "@/services/tenants/tenant.service";

export default async function GlobalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const tenant = await tenantService.getTenant();
    const user = await userService.getCurrentUser();

    return (
        <TenantProvider tenant={tenant}>
            <div className="flex flex-col gap-4">
                <div className="w-full flex items-center justify-end gap-4 p-4 border-b">
                    {user?.roles.find((r) => r === ROLES.admin) ? (
                        <div>
                            <Link href={"/admin"}>Admin</Link>
                        </div>
                    ) : null}
                    <Separator orientation="vertical" />
                    <SignedOut>
                        <SignInButton>
                            <Button className="cursor-pointer">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
                {children}
            </div>
        </TenantProvider>
    );
}
