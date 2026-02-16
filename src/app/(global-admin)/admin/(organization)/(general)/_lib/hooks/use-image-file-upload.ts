import { useCallback, useId, useRef, useState } from "react";
import { usePreviewObjectUrl } from "./use-preview-object-url";

/**
 * Shared state and handlers for image file upload with drag-and-drop,
 * preview URL, and optional "remove" flag. Use with a hidden file input
 * and your preview/empty-state UI.
 */
export function useImageFileUpload(currentUrl: string | null) {
    const [removeChecked, setRemoveChecked] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const { previewUrl, setPreviewFile, clearPreview } = usePreviewObjectUrl();

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] ?? null;
            setPreviewFile(file);
            if (file) setRemoveChecked(false);
        },
        [setPreviewFile]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file?.type.startsWith("image/")) {
                setPreviewFile(file);
                setRemoveChecked(false);
            }
        },
        [setPreviewFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleRemove = useCallback(() => {
        setRemoveChecked(true);
        clearPreview();
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [clearPreview]);

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const displayUrl = removeChecked ? null : (previewUrl ?? currentUrl);
    const hasImage = Boolean(currentUrl ?? previewUrl);
    const showRemove = hasImage && !removeChecked;

    return {
        fileInputRef,
        inputId,
        previewUrl,
        removeChecked,
        setRemoveChecked,
        isDragging,
        displayUrl,
        hasImage,
        showRemove,
        handleFileChange,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleRemove,
        openFilePicker,
        clearPreview,
    } as const;
}
