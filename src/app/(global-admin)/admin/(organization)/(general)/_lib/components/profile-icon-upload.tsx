"use client";

import { ProfileIconImage } from "@/app/components/profile-icon-image";
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

const INPUT_NAME = "profileIcon";

const PREVIEW_CONTAINER_CLASS =
    "bg-muted group relative flex aspect-square w-16 items-center justify-center overflow-hidden rounded-lg border text-left";
const CHANGE_LABEL_CLASS = "rounded px-2 py-1 text-xs font-medium shadow-sm";

interface ProfileIconUploadProps {
    profileIconUrl: string | null;
    orgName: string;
}

export function ProfileIconUpload({
    profileIconUrl,
    orgName,
}: ProfileIconUploadProps) {
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
    } = useImageFileUpload(profileIconUrl);

    return (
        <Field>
            <FieldLabel>Profile Icon</FieldLabel>
            <p className="text-muted-foreground mb-2 text-sm">
                Shown in various places in the app, including the sidebar. Square
                images work best.
            </p>
            {removeChecked && (
                <input type="hidden" name="removeProfileIcon" value="on" />
            )}
            <div className="space-y-3">
                {displayUrl && (
                    <button
                        type="button"
                        onClick={openFilePicker}
                        className={PREVIEW_CONTAINER_CLASS}
                        aria-label="Change profile icon"
                    >
                        <ProfileIconImage
                            src={displayUrl}
                            alt={`${orgName} profile icon`}
                            className="aspect-square w-16 rounded-lg"
                        />
                        <ImageUploadChangeOverlay
                            changeLabelClassName={CHANGE_LABEL_CLASS}
                        />
                    </button>
                )}

                {!displayUrl && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "border-border bg-muted/30 hover:bg-muted/50 has-[:focus-visible]:ring-ring flex aspect-square w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed transition-colors has-[:focus-visible]:ring-2",
                            isDragging && "bg-primary/10"
                        )}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <ImagePlusIcon className="text-muted-foreground size-6" />
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
