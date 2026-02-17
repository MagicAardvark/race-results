import { del, put } from "@vercel/blob";

export type ImageFieldConfig = {
    removeKey: string;
    fileKey: string;
    currentUrlKey: string;
    section: string;
    uploadErrorLabel: string;
};

export type ImageFieldResult =
    | { ok: true; url: string | null | undefined }
    | { ok: false; error: { isError: boolean; message: string } };

function isVercelBlobUrl(url: string): boolean {
    try {
        return new URL(url).hostname.endsWith(".vercel-storage.com");
    } catch {
        return false;
    }
}

export async function processImageField(
    formData: FormData,
    orgId: string,
    config: ImageFieldConfig
): Promise<ImageFieldResult> {
    const remove = formData.get(config.removeKey) === "on";
    const file = formData.get(config.fileKey) as File | null;
    const currentUrl = formData.get(config.currentUrlKey)?.toString()?.trim();

    if (remove) {
        if (currentUrl && isVercelBlobUrl(currentUrl)) {
            try {
                await del([currentUrl]);
            } catch {
                /* best-effort; still clear DB field */
            }
        }
        return { ok: true, url: null };
    }

    if (file?.size) {
        // easy path structure to avoid collisions. One header and one profile image per org.
        // allowOverwrite: true because we want to overwrite the existing image if it exists.
        const pathname = `${orgId}/${config.section}`;
        try {
            const blob = await put(pathname, file, {
                access: "public",
                allowOverwrite: true,
            });
            return { ok: true, url: blob.url };
        } catch (err) {
            return {
                ok: false,
                error: {
                    isError: true,
                    message:
                        err instanceof Error
                            ? err.message
                            : `Failed to upload ${config.uploadErrorLabel}`,
                },
            };
        }
    }

    return { ok: true, url: undefined };
}

export const ORG_IMAGE_FIELDS: ImageFieldConfig[] = [
    {
        removeKey: "removeHeaderImage",
        fileKey: "headerImage",
        currentUrlKey: "currentHeaderImageUrl",
        section: "org-header",
        uploadErrorLabel: "header image",
    },
    {
        removeKey: "removeProfileIcon",
        fileKey: "profileIcon",
        currentUrlKey: "currentProfileIconUrl",
        section: "org-profile-icon",
        uploadErrorLabel: "profile icon",
    },
];
