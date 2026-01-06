import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationsAPIRepository } from "./organizations.api.repo";
import { db } from "@/db";

// Mock db.execute
vi.mock("@/db", () => ({
    db: {
        execute: vi.fn(),
    },
}));

describe("OrganizationsAPIRepository", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("validateApiRequest", () => {
        it("returns true when API key is valid", async () => {
            vi.mocked(db.execute).mockResolvedValue({
                rowCount: 1,
            } as never);

            const result = await organizationsAPIRepository.validateApiRequest(
                "test-org",
                "valid-key"
            );

            expect(result).toBe(true);
            expect(db.execute).toHaveBeenCalled();
        });

        it("returns false when API key is invalid", async () => {
            vi.mocked(db.execute).mockResolvedValue({
                rowCount: 0,
            } as never);

            const result = await organizationsAPIRepository.validateApiRequest(
                "test-org",
                "invalid-key"
            );

            expect(result).toBe(false);
        });

        it("returns false when rowCount is not 1", async () => {
            vi.mocked(db.execute).mockResolvedValue({
                rowCount: 2,
            } as never);

            const result = await organizationsAPIRepository.validateApiRequest(
                "test-org",
                "key"
            );

            expect(result).toBe(false);
        });
    });
});
