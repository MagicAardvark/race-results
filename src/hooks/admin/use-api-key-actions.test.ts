import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useApiKeyActions } from "./use-api-key-actions";
import { updateApiKey } from "@/app/actions/organization.actions";
import { toast } from "sonner";

// Mock dependencies
vi.mock("@/app/actions/organization.actions", () => ({
    updateApiKey: vi.fn(),
}));

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

    it("calls updateApiKey with correct parameters when enabling", async () => {
        vi.mocked(updateApiKey).mockResolvedValue(undefined);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        await result.current.handleUpdateApiKey({ isEnabled: true });

        await waitFor(() => {
            expect(updateApiKey).toHaveBeenCalledWith(orgId, {
                isEnabled: true,
            });
        });
    });

    it("calls updateApiKey with correct parameters when disabling", async () => {
        vi.mocked(updateApiKey).mockResolvedValue(undefined);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        await result.current.handleUpdateApiKey({ isEnabled: false });

        await waitFor(() => {
            expect(updateApiKey).toHaveBeenCalledWith(orgId, {
                isEnabled: false,
            });
        });
    });

    it("shows success toast when enabling API key", async () => {
        vi.mocked(updateApiKey).mockResolvedValue(undefined);

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
        vi.mocked(updateApiKey).mockResolvedValue(undefined);

        const { result } = renderHook(() => useApiKeyActions(orgId));

        await result.current.handleUpdateApiKey({ isEnabled: false });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("API Access Disabled", {
                description:
                    "API access has been disabled for this organization.",
            });
        });
    });

    it("shows error toast when updateApiKey fails", async () => {
        const error = new Error("Update failed");
        vi.mocked(updateApiKey).mockRejectedValue(error);

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
        vi.mocked(updateApiKey).mockRejectedValue("Unknown error");

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
