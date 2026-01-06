"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Hook for managing URL search param filters
 * Provides utilities for reading and updating filter state in the URL
 */
export function useUrlFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const updateFilters = (paramName: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (values.length > 0) {
            params.set(paramName, values.join(","));
        } else {
            params.delete(paramName);
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    const getFilters = (paramName: string, validValues?: string[]): string[] => {
        const param = searchParams.get(paramName);
        if (!param) return [];
        const values = param.split(",");
        if (validValues) {
            return values.filter((v) => validValues.includes(v));
        }
        return values;
    };

    return {
        getFilters,
        updateFilters,
        searchParams,
    };
}

