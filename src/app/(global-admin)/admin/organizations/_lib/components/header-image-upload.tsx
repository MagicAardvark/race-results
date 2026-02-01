"use client";

import { Button } from "@/ui/button";
import { Field, FieldLabel } from "@/ui/field";
import { cn } from "@/lib/utils";
import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const INPUT_NAME = "headerImage";
const ACCEPT_IMAGE = "image/*";

const PREVIEW_CONTAINER_CLASS =
    "bg-muted group relative aspect-[2/1] w-full max-w-xl overflow-hidden rounded-lg border text-left";
const OVERLAY_CLASS =
    "absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";
const CHANGE_BADGE_CLASS =
    "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";
const CHANGE_LABEL_CLASS =
    "bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium shadow-sm";

interface HeaderImageUploadProps {
    headerImageUrl: string | null;
    orgName: string;
}

function usePreviewObjectUrl() {
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

export function HeaderImageUpload({
    headerImageUrl,
    orgName,
}: HeaderImageUploadProps) {
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

    const displayUrl = removeChecked ? null : (previewUrl ?? headerImageUrl);
    const hasImage = Boolean(headerImageUrl ?? previewUrl);
    const showRemove = hasImage && !removeChecked;

    return (
        <Field>
            <FieldLabel>Header Image</FieldLabel>
            {removeChecked && (
                <input type="hidden" name="removeHeaderImage" value="on" />
            )}
            <div className="mt-2 space-y-3">
                {displayUrl && (
                    <button
                        type="button"
                        onClick={openFilePicker}
                        className={PREVIEW_CONTAINER_CLASS}
                        aria-label="Change header image"
                    >
                        <Image
                            src={displayUrl}
                            alt={`${orgName} header`}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <span className={OVERLAY_CLASS} aria-hidden />
                        <span className={CHANGE_BADGE_CLASS} aria-hidden>
                            <span className={CHANGE_LABEL_CLASS}>Change</span>
                        </span>
                    </button>
                )}

                {!displayUrl && (
                    <label
                        htmlFor={inputId}
                        className="border-border bg-muted/30 hover:bg-muted/50 has-[:focus-visible]:ring-ring flex min-h-[140px] w-full max-w-xl cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 transition-colors has-[:focus-visible]:ring-2"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <div
                            className={cn(
                                "flex size-14 items-center justify-center rounded-full transition-colors",
                                isDragging
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground bg-muted"
                            )}
                        >
                            <ImagePlusIcon className="size-8" />
                        </div>
                        <span className="text-foreground font-medium">
                            Select image to upload
                        </span>
                        <span className="text-muted-foreground text-sm">
                            or drag and drop
                        </span>
                    </label>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    name={INPUT_NAME}
                    accept={ACCEPT_IMAGE}
                    multiple={false}
                    onChange={handleFileChange}
                    className="sr-only"
                    id={inputId}
                    aria-hidden
                />

                <div className="flex flex-wrap items-center gap-2">
                    {showRemove && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={handleRemove}
                        >
                            Remove
                        </Button>
                    )}
                    {previewUrl && (
                        <span className="text-muted-foreground text-xs">
                            New image selected (save to apply)
                        </span>
                    )}
                </div>
            </div>
        </Field>
    );
}
