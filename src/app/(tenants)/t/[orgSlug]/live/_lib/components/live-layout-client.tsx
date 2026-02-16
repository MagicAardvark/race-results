"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";
import { ClientTenantLink } from "@/app/(tenants)/t/_lib/components/client-tenant-link";
import type { NavigationPage } from "../utils/navigation";

export function LiveLayoutClient({
    children,
    basePath,
    navigationPages,
}: {
    children: React.ReactNode;
    basePath: string;
    /** Nav items computed on server from feature flags (SSR). */
    navigationPages: NavigationPage[];
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        router.refresh();
        // Reset loading state after a short delay to allow refresh to complete
        setTimeout(() => setIsRefreshing(false), 1000);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center pb-[100px]">
            <nav className="mt-4 mb-2 flex w-full max-w-7xl items-center justify-between gap-2 px-4">
                <div className="flex flex-wrap items-center gap-2">
                    {navigationPages.map((page) => {
                        const isActive =
                            pathname === page.link ||
                            (page.link === basePath && pathname === basePath);
                        return (
                            <Button
                                key={page.link}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                asChild
                            >
                                <ClientTenantLink
                                    pathFromTenantRoot={page.link}
                                    tenantBase={basePath}
                                >
                                    {page.name}
                                </ClientTenantLink>
                            </Button>
                        );
                    })}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-8 w-8 p-0"
                    title="Refresh data"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                </Button>
            </nav>
            <div className="mt-4 w-full max-w-7xl px-4">{children}</div>
        </div>
    );
}
