"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const SUCCESS_MESSAGE = "Saved successfully";

/**
 * Handles URL feedback params: shows a toast and removes the param.
 * - ?saved=true → success toast
 * - ?error=... → error toast with that message
 * Rendered by the admin layout so form pages don't need their own toast logic.
 */
export function SavedToastHandler() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        let shouldReplace = false;

        const errorMessage = searchParams.get("error");
        if (errorMessage) {
            toast.error(errorMessage);
            params.delete("error");
            shouldReplace = true;
        }

        if (searchParams.get("saved") === "true") {
            toast.success(SUCCESS_MESSAGE);
            params.delete("saved");
            shouldReplace = true;
        }

        if (shouldReplace) {
            const search = params.toString();
            router.replace(search ? `${pathname}?${search}` : pathname);
        }
    }, [pathname, searchParams, router]);

    return null;
}
