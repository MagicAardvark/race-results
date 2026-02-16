"use client";

import {
    ACCEPT_IMAGE,
    ImageUploadActions,
    ImageUploadChangeOverlay,
    ImageUploadFileInput,
} from "@/app/(global-admin)/admin/(organization)/(general)/_lib/components/image-upload-shared";
import { useImageFileUpload } from "@/app/(global-admin)/admin/(organization)/(general)/_lib/hooks/use-image-file-upload";
import { Field, FieldLabel } from "@/ui/field";
import { cn } from "@/lib/utils";
import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";

const INPUT_NAME = "headerImage";

const PREVIEW_CONTAINER_CLASS =
    "bg-muted group relative aspect-[2/1] w-full max-w-xl overflow-hidden rounded-lg border text-left";
const CHANGE_LABEL_CLASS = "rounded-md px-4 py-2 text-sm font-medium shadow-sm";

interface HeaderImageUploadProps {
    headerImageUrl: string | null;
    orgName: string;
}

export function HeaderImageUpload({
    headerImageUrl,
    orgName,
}: HeaderImageUploadProps) {
    const {
        fileInputRef,
        inputId,
        previewUrl,
        removeChecked,
        isDragging,
        displayUrl,
        showRemove,
        handleFileChange,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleRemove,
        openFilePicker,
    } = useImageFileUpload(headerImageUrl);

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
                        <ImageUploadChangeOverlay
                            changeLabelClassName={CHANGE_LABEL_CLASS}
                        />
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

                <ImageUploadFileInput
                    inputRef={fileInputRef}
                    name={INPUT_NAME}
                    accept={ACCEPT_IMAGE}
                    id={inputId}
                    onChange={handleFileChange}
                />

                <ImageUploadActions
                    showRemove={showRemove}
                    onRemove={handleRemove}
                    hasNewSelection={Boolean(previewUrl)}
                />
            </div>
        </Field>
    );
}
