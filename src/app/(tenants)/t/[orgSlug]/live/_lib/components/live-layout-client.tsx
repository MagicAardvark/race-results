"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Button } from "@/ui/button";
import { RefreshCw } from "lucide-react";
import { getNavigationPages } from "../utils/navigation";
import { useLiveData } from "../hooks/useLiveData";
import { useState, useMemo, useCallback } from "react";

export function LiveLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();
    const { featureFlags } = useLiveData();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const orgSlug = params.orgSlug as string;
    const basePath = useMemo(() => `/t/${orgSlug}/live`, [orgSlug]);
    const navigationPages = useMemo(
        () => getNavigationPages(basePath, featureFlags),
        [basePath, featureFlags]
    );

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
                                <Link href={page.link}>{page.name}</Link>
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
