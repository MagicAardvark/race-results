import { describe, it, expect, vi, beforeEach } from "vitest";
import { linkDriverToCurrentUser } from "./user-profile";
import { auth, currentUser } from "@clerk/nextjs/server";
import { userService } from "@/services/users/user.service";
import { revalidatePath } from "next/cache";
import { createMockUserWithExtendedDetails } from "@/__tests__/mocks/mock-users";

vi.mock("@clerk/nextjs/server");
vi.mock("@/services/users/user.service");
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

describe("linkDriverToCurrentUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns error when not signed in", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as never);

        const result = await linkDriverToCurrentUser("msr-1", "Alice Smith");

        expect(result).toEqual({
            ok: false,
            message: "You must be signed in to link your driver.",
        });
        expect(userService.getCurrentUser).not.toHaveBeenCalled();
        expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it("returns error when DB user not found", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk-123" } as never);
        vi.mocked(currentUser).mockResolvedValue({
            primaryEmailAddress: { emailAddress: "alice@example.com" },
        } as never);
        vi.mocked(userService.getCurrentUser).mockResolvedValue(null);

        const result = await linkDriverToCurrentUser("msr-1", "Alice Smith");

        expect(result).toEqual({
            ok: false,
            message: "User record not found. Please sign in again.",
        });
        expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it("updates user with driver name and msrId on success", async () => {
        const mockUser = createMockUserWithExtendedDetails({
            userId: "user-1",
        });
        vi.mocked(auth).mockResolvedValue({ userId: "clerk-123" } as never);
        vi.mocked(currentUser).mockResolvedValue({
            primaryEmailAddress: { emailAddress: "alice@example.com" },
        } as never);
        vi.mocked(userService.getCurrentUser).mockResolvedValue(mockUser);
        vi.mocked(userService.updateUser).mockResolvedValue(undefined);

        const result = await linkDriverToCurrentUser("msr-42", "Alice Smith");

        expect(result).toEqual({ ok: true });
        expect(userService.updateUser).toHaveBeenCalledWith("user-1", {
            motorsportregId: "msr-42",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice@example.com",
            displayName: "Alice S",
            driverLinkedAt: expect.any(Date),
        });
        expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("trims msrId and accepts empty string as null", async () => {
        const mockUser = createMockUserWithExtendedDetails({
            userId: "user-1",
        });
        vi.mocked(auth).mockResolvedValue({ userId: "clerk-123" } as never);
        vi.mocked(currentUser).mockResolvedValue({
            primaryEmailAddress: { emailAddress: "bob@example.com" },
        } as never);
        vi.mocked(userService.getCurrentUser).mockResolvedValue(mockUser);
        vi.mocked(userService.updateUser).mockResolvedValue(undefined);

        await linkDriverToCurrentUser("  ", "Bob Jones");

        expect(userService.updateUser).toHaveBeenCalledWith(
            "user-1",
            expect.objectContaining({
                motorsportregId: null,
                firstName: "Bob",
                lastName: "Jones",
                displayName: "Bob J",
            })
        );
    });

    it("parses single-word name as firstName only", async () => {
        const mockUser = createMockUserWithExtendedDetails({
            userId: "user-1",
        });
        vi.mocked(auth).mockResolvedValue({ userId: "clerk-123" } as never);
        vi.mocked(currentUser).mockResolvedValue({
            primaryEmailAddress: null,
        } as never);
        vi.mocked(userService.getCurrentUser).mockResolvedValue(mockUser);
        vi.mocked(userService.updateUser).mockResolvedValue(undefined);

        await linkDriverToCurrentUser("msr-1", "Madonna");

        expect(userService.updateUser).toHaveBeenCalledWith(
            "user-1",
            expect.objectContaining({
                firstName: "Madonna",
                lastName: null,
                displayName: "Madonna",
            })
        );
    });

    it("formats display name as FirstName L for multi-word name", async () => {
        const mockUser = createMockUserWithExtendedDetails({
            userId: "user-1",
        });
        vi.mocked(auth).mockResolvedValue({ userId: "clerk-123" } as never);
        vi.mocked(currentUser).mockResolvedValue({
            primaryEmailAddress: { emailAddress: "dan@example.com" },
        } as never);
        vi.mocked(userService.getCurrentUser).mockResolvedValue(mockUser);
        vi.mocked(userService.updateUser).mockResolvedValue(undefined);

        await linkDriverToCurrentUser("msr-1", "Dan Johns");

        expect(userService.updateUser).toHaveBeenCalledWith(
            "user-1",
            expect.objectContaining({
                displayName: "Dan J",
            })
        );
    });
});
