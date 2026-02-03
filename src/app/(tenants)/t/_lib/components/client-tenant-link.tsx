import { joinTenantPath } from "@/app/(tenants)/t/_lib/utils/join-tenant-path";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type ClientTenantLinkProps = Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href"
> & {
    pathFromTenantRoot: string;
    tenantBase: string;
};

export function ClientTenantLink({
    pathFromTenantRoot,
    tenantBase,
    children,
    ...props
}: ClientTenantLinkProps) {
    const href = joinTenantPath(tenantBase, pathFromTenantRoot);
    return (
        <Link href={href} {...props}>
            {children}
        </Link>
    );
}
