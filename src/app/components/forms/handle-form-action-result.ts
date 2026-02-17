"use client";

import { toast } from "sonner";
import type { FormResponse } from "@/types/forms";

/**
 * Handles a FormResponse from a dialog form action: shows toast and updates
 * error state. Returns true on success so the caller can run onSuccess/close/reset.
 */
export function handleFormActionResult<T>(
    result: FormResponse<T>,
    setError: (value: FormResponse<T> | null) => void
): result is FormResponse<T> & { isError: false; data: T } {
    if (result.isError) {
        setError(result);
        const message = Array.isArray(result.errors)
            ? result.errors[0]
            : result.errors;
        toast.error(message ?? "Something went wrong");
        return false;
    }
    setError(null);
    toast.success(result.message);
    return true;
}
