import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    createOrgEventAdmin,
    updateOrgEventAdmin,
    deleteOrgEventAdmin,
} from "./event.actions";
import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { requireRole } from "@/lib/auth/require-role";
import { revalidatePath } from "next/cache";

vi.mock("@/db/repositories/org-events.repo");
vi.mock("@/lib/auth/require-role");
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

describe("event.actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(requireRole).mockResolvedValue(undefined);
    });

    describe("createOrgEventAdmin", () => {
        it("creates event and revalidates when form is valid", async () => {
            vi.mocked(orgEventsRepository.create).mockResolvedValue({
                eventId: "evt-1",
                orgId: "org-1",
                name: "Test Event",
                startAt: new Date("2026-06-10"),
                endAt: new Date("2026-06-10"),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const formData = new FormData();
            formData.append("orgId", "org-1");
            formData.append("slug", "test-org");
            formData.append("name", "Test Event");
            formData.append("startDate", "2026-06-10");
            formData.append("endDate", "2026-06-10");

            const result = await createOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(false);
            expect(result.message).toBe("Event created");
            expect(orgEventsRepository.create).toHaveBeenCalledWith({
                orgId: "org-1",
                name: "Test Event",
                startAt: expect.any(Date),
                endAt: expect.any(Date),
            });
            expect(revalidatePath).toHaveBeenCalledWith(
                "/admin/organizations/test-org"
            );
        });

        it("returns error when orgId is missing", async () => {
            const formData = new FormData();
            formData.append("name", "Test Event");
            formData.append("startDate", "2026-06-10");

            const result = await createOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Organization is required");
            expect(orgEventsRepository.create).not.toHaveBeenCalled();
        });

        it("returns error when name is empty", async () => {
            const formData = new FormData();
            formData.append("orgId", "org-1");
            formData.append("startDate", "2026-06-10");
            formData.append("endDate", "2026-06-10");

            const result = await createOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Event name is required");
        });

        it("returns error when end date is before start date", async () => {
            const formData = new FormData();
            formData.append("orgId", "org-1");
            formData.append("name", "Test Event");
            formData.append("startDate", "2026-06-15");
            formData.append("endDate", "2026-06-10");

            const result = await createOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe(
                "End date must be on or after start date"
            );
        });

        it("defaults endDate to startDate when not provided", async () => {
            vi.mocked(orgEventsRepository.create).mockResolvedValue({
                eventId: "evt-1",
                orgId: "org-1",
                name: "Single Day",
                startAt: new Date("2026-06-10"),
                endAt: new Date("2026-06-10"),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const formData = new FormData();
            formData.append("orgId", "org-1");
            formData.append("name", "Single Day");
            formData.append("startDate", "2026-06-10");

            const result = await createOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(false);
            expect(orgEventsRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Single Day",
                })
            );
        });
    });

    describe("updateOrgEventAdmin", () => {
        it("updates event when form is valid", async () => {
            vi.mocked(orgEventsRepository.update).mockResolvedValue({
                eventId: "evt-1",
                orgId: "org-1",
                name: "Updated Event",
                startAt: new Date("2026-06-12"),
                endAt: new Date("2026-06-12"),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const formData = new FormData();
            formData.append("eventId", "evt-1");
            formData.append("orgId", "org-1");
            formData.append("slug", "test-org");
            formData.append("name", "Updated Event");
            formData.append("startDate", "2026-06-12");
            formData.append("endDate", "2026-06-12");

            const result = await updateOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(false);
            expect(result.message).toBe("Event updated");
            expect(orgEventsRepository.update).toHaveBeenCalledWith(
                "evt-1",
                "org-1",
                expect.objectContaining({
                    name: "Updated Event",
                })
            );
        });

        it("returns error when eventId or orgId is missing", async () => {
            const formData = new FormData();
            formData.append("name", "Event");
            formData.append("startDate", "2026-06-10");

            const result = await updateOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe(
                "Event and organization are required"
            );
        });

        it("returns error when update returns null", async () => {
            vi.mocked(orgEventsRepository.update).mockResolvedValue(null);

            const formData = new FormData();
            formData.append("eventId", "evt-1");
            formData.append("orgId", "org-1");
            formData.append("name", "Event");
            formData.append("startDate", "2026-06-10");

            const result = await updateOrgEventAdmin(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe(
                "Event not found or access denied"
            );
        });
    });

    describe("deleteOrgEventAdmin", () => {
        it("deletes event and revalidates when successful", async () => {
            vi.mocked(orgEventsRepository.delete).mockResolvedValue(true);

            const result = await deleteOrgEventAdmin(
                "evt-1",
                "org-1",
                "test-org"
            );

            expect(result.isError).toBe(false);
            expect(result.message).toBe("Event deleted");
            expect(orgEventsRepository.delete).toHaveBeenCalledWith(
                "evt-1",
                "org-1"
            );
            expect(revalidatePath).toHaveBeenCalledWith(
                "/admin/organizations/test-org"
            );
        });

        it("returns error when eventId or orgId is missing", async () => {
            const result = await deleteOrgEventAdmin("", "org-1", "test-org");

            expect(result.isError).toBe(true);
            expect(result.message).toBe(
                "Event and organization are required"
            );
        });

        it("returns error when delete returns false", async () => {
            vi.mocked(orgEventsRepository.delete).mockResolvedValue(false);

            const result = await deleteOrgEventAdmin(
                "evt-1",
                "org-1",
                "test-org"
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe(
                "Event not found or access denied"
            );
        });
    });
});
