import { describe, it, expect, vi, beforeEach } from "vitest";
import { del, put } from "@vercel/blob";
import {
    processImageField,
    ORG_IMAGE_FIELDS,
    type ImageFieldConfig,
} from "../process-org-image-fields";

vi.mock("@vercel/blob", () => ({
    put: vi.fn(),
    del: vi.fn(),
}));

const config: ImageFieldConfig = {
    removeKey: "removeImage",
    fileKey: "imageFile",
    currentUrlKey: "currentImageUrl",
    section: "test-section",
    uploadErrorLabel: "test image",
};

describe("processImageField", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns url undefined when neither remove nor file is set", async () => {
        const formData = new FormData();

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({ ok: true, url: undefined });
        expect(put).not.toHaveBeenCalled();
        expect(del).not.toHaveBeenCalled();
    });

    it("returns url null and deletes blob when remove is on and currentUrl is Vercel blob", async () => {
        const formData = new FormData();
        formData.set("removeImage", "on");
        formData.set(
            "currentImageUrl",
            "https://abc.public.vercel-storage.com/old.png"
        );

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({ ok: true, url: null });
        expect(del).toHaveBeenCalledWith([
            "https://abc.public.vercel-storage.com/old.png",
        ]);
        expect(put).not.toHaveBeenCalled();
    });

    it("returns url null and does not call del when remove is on but currentUrl is not Vercel blob", async () => {
        const formData = new FormData();
        formData.set("removeImage", "on");
        formData.set("currentImageUrl", "https://example.com/external.png");

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({ ok: true, url: null });
        expect(del).not.toHaveBeenCalled();
        expect(put).not.toHaveBeenCalled();
    });

    it("returns url null when remove is on and currentUrl is missing", async () => {
        const formData = new FormData();
        formData.set("removeImage", "on");

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({ ok: true, url: null });
        expect(del).not.toHaveBeenCalled();
    });

    it("uploads file and returns blob url when file is provided", async () => {
        const formData = new FormData();
        const file = new File(["content"], "photo.jpg", { type: "image/jpeg" });
        formData.set("imageFile", file);

        vi.mocked(put).mockResolvedValue({
            url: "https://blob.vercel-storage.com/org-123/test-section",
            pathname: "org-123/test-section",
        } as never);

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({
            ok: true,
            url: "https://blob.vercel-storage.com/org-123/test-section",
        });
        expect(put).toHaveBeenCalledWith(
            "org-123/test-section",
            file,
            expect.objectContaining({
                access: "public",
                allowOverwrite: true,
            })
        );
        expect(del).not.toHaveBeenCalled();
    });

    it("returns error when put throws", async () => {
        const formData = new FormData();
        formData.set("imageFile", new File(["x"], "photo.jpg"));

        vi.mocked(put).mockRejectedValue(new Error("Upload failed"));

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({
            ok: false,
            error: {
                isError: true,
                message: "Upload failed",
            },
        });
        expect(put).toHaveBeenCalled();
    });

    it("returns uploadErrorLabel in error message when put throws non-Error", async () => {
        const formData = new FormData();
        formData.set("imageFile", new File(["x"], "photo.jpg"));

        vi.mocked(put).mockRejectedValue("string error");

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({
            ok: false,
            error: {
                isError: true,
                message: "Failed to upload test image",
            },
        });
    });

    it("does not upload when file has size 0", async () => {
        const formData = new FormData();
        formData.set("imageFile", new File([], "empty.jpg"));

        const result = await processImageField(formData, "org-123", config);

        expect(result).toEqual({ ok: true, url: undefined });
        expect(put).not.toHaveBeenCalled();
    });
});

describe("ORG_IMAGE_FIELDS", () => {
    it("includes header and profile icon configs", () => {
        expect(ORG_IMAGE_FIELDS).toHaveLength(2);

        const header = ORG_IMAGE_FIELDS.find((c) => c.section === "org-header");
        expect(header).toBeDefined();
        expect(header?.removeKey).toBe("removeHeaderImage");
        expect(header?.fileKey).toBe("headerImage");
        expect(header?.currentUrlKey).toBe("currentHeaderImageUrl");
        expect(header?.uploadErrorLabel).toBe("header image");

        const profile = ORG_IMAGE_FIELDS.find(
            (c) => c.section === "org-profile-icon"
        );
        expect(profile).toBeDefined();
        expect(profile?.removeKey).toBe("removeProfileIcon");
        expect(profile?.fileKey).toBe("profileIcon");
        expect(profile?.currentUrlKey).toBe("currentProfileIconUrl");
        expect(profile?.uploadErrorLabel).toBe("profile icon");
    });
});
