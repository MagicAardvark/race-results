import { getTenantBasePath } from "@/app/(tenants)/t/_lib/utils/get-tenant-base-path";
import { joinTenantPath } from "@/app/(tenants)/t/_lib/utils/join-tenant-path";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type TenantLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
    pathFromTenantRoot: string;
};

export const TenantLink = async ({
    pathFromTenantRoot,
    children,
    ...props
}: TenantLinkProps) => {
    const tenantBase = await getTenantBasePath();
    const href = joinTenantPath(tenantBase, pathFromTenantRoot);

    return (
        <Link href={href} {...props}>
            {children}
        </Link>
    );
};
