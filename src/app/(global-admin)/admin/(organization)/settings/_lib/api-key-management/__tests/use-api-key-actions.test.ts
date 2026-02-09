import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { generateApiKey } from "@/app/(global-admin)/admin/(organization)/settings/_lib/api-key-management/actions/generate-api-key";
import { useApiKeyActions } from "@/app/(global-admin)/admin/(organization)/settings/_lib/api-key-management/hooks/use-api-key-actions";

// Mock dependencies
vi.mock(
    "@/app/(global-admin)/admin/(organization)/settings/_lib/api-key-management/actions/generate-api-key",
    () => ({
        generateApiKey: vi.fn(),
    })
);

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("useApiKeyActions", () => {
    const orgId = "test-org-id";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns handleUpdateApiKey and isPending", () => {
        const { result } = renderHook(() => useApiKeyActions(orgId));

        expect(result.current.handleUpdateApiKey).toBeDefined();
        expect(typeof result.current.handleUpdateApiKey).toBe("function");
        expect(result.current.isPending).toBe(false);
    });

    it("calls generateApiKey with correct parameters when enabling", async () => {
        vi.mocked(generateApiKey).mockResolvedValue(undefined);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        await result.current.handleUpdateApiKey({ isEnabled: true });

        await waitFor(() => {
            expect(generateApiKey).toHaveBeenCalledWith(orgId, {
                isEnabled: true,
            });
        });
    });

    it("calls generateApiKey with correct parameters when disabling", async () => {
        vi.mocked(generateApiKey).mockResolvedValue(undefined);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        await result.current.handleUpdateApiKey({ isEnabled: false });

        await waitFor(() => {
            expect(generateApiKey).toHaveBeenCalledWith(orgId, {
                isEnabled: false,
            });
        });
    });

    it("shows success toast when enabling API key", async () => {
        vi.mocked(generateApiKey).mockResolvedValue(undefined);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        await result.current.handleUpdateApiKey({ isEnabled: true });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("API Key Generated", {
                description:
                    "A new API key has been created and is now active.",
            });
        });
    });

    it("shows success toast when disabling API key", async () => {
        vi.mocked(generateApiKey).mockResolvedValue(undefined);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        await result.current.handleUpdateApiKey({ isEnabled: false });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("API Access Disabled", {
                description:
                    "API access has been disabled for this organization.",
            });
        });
    });

    it("shows error toast when generateApiKey fails", async () => {
        const error = new Error("Update failed");
        vi.mocked(generateApiKey).mockRejectedValue(error);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        try {
            await result.current.handleUpdateApiKey({ isEnabled: true });
        } catch {
            // Expected to throw
        }

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to create API Key",
                {
                    duration: 4000,
                    description: "Update failed",
                }
            );
        });
    });

    it("handles unknown error types", async () => {
        vi.mocked(generateApiKey).mockRejectedValue("Unknown error");

        const { result } = renderHook(() => useApiKeyActions(orgId));

        try {
            await result.current.handleUpdateApiKey({ isEnabled: true });
        } catch {
            // Expected to throw
        }

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to create API Key",
                {
                    duration: 4000,
                    description: "An unknown error occurred",
                }
            );
        });
    });
});
