import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationsAPIService } from "./organizations.api.service";
import { organizationsAPIRepository } from "@/db/repositories/organizations.api.repo";

// Mock the repository
vi.mock("@/db/repositories/organizations.api.repo", () => ({
    organizationsAPIRepository: {
        validateApiRequest: vi.fn(),
    },
}));

describe("OrganizationsAPIService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("validates API request by delegating to repository", async () => {
        vi.mocked(
            organizationsAPIRepository.validateApiRequest
        ).mockResolvedValue(true);

        const result = await organizationsAPIService.validateApiRequest(
            "test-org",
            "test-key"
        );

        expect(result).toBe(true);
        expect(
            organizationsAPIRepository.validateApiRequest
        ).toHaveBeenCalledWith("test-org", "test-key");
    });

    it("returns false when validation fails", async () => {
        vi.mocked(
            organizationsAPIRepository.validateApiRequest
        ).mockResolvedValue(false);

        const result = await organizationsAPIService.validateApiRequest(
            "invalid-org",
            "invalid-key"
        );

        expect(result).toBe(false);
        expect(
            organizationsAPIRepository.validateApiRequest
        ).toHaveBeenCalledWith("invalid-org", "invalid-key");
    });

    it("handles repository errors", async () => {
        vi.mocked(
            organizationsAPIRepository.validateApiRequest
        ).mockRejectedValue(new Error("Database error"));

        await expect(
            organizationsAPIService.validateApiRequest("test-org", "test-key")
        ).rejects.toThrow("Database error");
    });
});
