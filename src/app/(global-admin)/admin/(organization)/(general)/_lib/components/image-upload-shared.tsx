"use client";

import { Button } from "@/ui/button";
import { RefObject } from "react";

/** Shared across header and profile icon uploads. */
export const ACCEPT_IMAGE = "image/*";

export const IMAGE_UPLOAD_OVERLAY_CLASS =
    "absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";
export const IMAGE_UPLOAD_CHANGE_BADGE_CLASS =
    "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";

interface ImageUploadChangeOverlayProps {
    /** Class for the "Change" label (e.g. size/padding). */
    changeLabelClassName: string;
}

export function ImageUploadChangeOverlay({
    changeLabelClassName,
}: ImageUploadChangeOverlayProps) {
    return (
        <>
            <span className={IMAGE_UPLOAD_OVERLAY_CLASS} aria-hidden />
            <span className={IMAGE_UPLOAD_CHANGE_BADGE_CLASS} aria-hidden>
                <span
                    className={`bg-primary text-primary-foreground ${changeLabelClassName}`}
                >
                    Change
                </span>
            </span>
        </>
    );
}

interface ImageUploadFileInputProps {
    inputRef: RefObject<HTMLInputElement | null>;
    name: string;
    accept: string;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploadFileInput({
    inputRef,
    name,
    accept,
    id,
    onChange,
}: ImageUploadFileInputProps) {
    return (
        <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            multiple={false}
            onChange={onChange}
            className="sr-only"
            id={id}
            aria-hidden
        />
    );
}

interface ImageUploadActionsProps {
    showRemove: boolean;
    onRemove: () => void;
    hasNewSelection: boolean;
}

export function ImageUploadActions({
    showRemove,
    onRemove,
    hasNewSelection,
}: ImageUploadActionsProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {showRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={onRemove}
                >
                    Remove
                </Button>
            )}
            {hasNewSelection && (
                <span className="text-muted-foreground text-xs">
                    New image selected (save to apply)
                </span>
            )}
        </div>
    );
}
