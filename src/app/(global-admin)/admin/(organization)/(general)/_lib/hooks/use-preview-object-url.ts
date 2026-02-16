import { useCallback, useEffect, useState } from "react";

/**
 * Hook to manage a preview object URL for file inputs (e.g. image uploads).
 * Revokes the previous URL when the file changes or on unmount.
 */
export function usePreviewObjectUrl() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const setPreviewFile = useCallback((file: File | null) => {
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : null;
        });
    }, []);

    const clearPreview = useCallback(() => setPreviewUrl(null), []);

    return { previewUrl, setPreviewFile, clearPreview } as const;
}
