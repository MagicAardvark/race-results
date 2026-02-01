"use server";

import { ROLES } from "@/constants/global";
import { orgEventsRepository } from "@/db/repositories/org-events.repo";
import { tenantService } from "@/services/tenants/tenant.service";
import { requireRole } from "@/lib/auth/require-role";
import { revalidatePath } from "next/cache";

type CreateEventState = {
    isError: boolean;
    message: string;
};

export async function createOrgEvent(
    _: CreateEventState,
    formData: FormData
): Promise<CreateEventState> {
    const tenant = await tenantService.getTenant();
    if (!tenant.isValid) {
        return { isError: true, message: "Invalid organization context" };
    }

    const name = formData.get("name")?.toString().trim();
    const startDate = formData.get("startDate")?.toString();
    const endDate = formData.get("endDate")?.toString();

    if (!name) {
        return { isError: true, message: "Event name is required" };
    }
    if (!startDate) {
        return { isError: true, message: "Start date is required" };
    }
    if (!endDate) {
        return { isError: true, message: "End date is required" };
    }

    const startAt = new Date(`${startDate}T00:00:00`);
    const endAt = new Date(`${endDate}T23:59:59.999`);

    if (Number.isNaN(startAt.getTime())) {
        return { isError: true, message: "Invalid start date" };
    }
    if (Number.isNaN(endAt.getTime())) {
        return { isError: true, message: "Invalid end date" };
    }
    if (endAt < startAt) {
        return {
            isError: true,
            message: "End date must be on or after start date",
        };
    }

    try {
        await orgEventsRepository.create({
            orgId: tenant.org.orgId,
            name,
            startAt,
            endAt,
        });
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create event",
        };
    }

    revalidatePath(`/t/${tenant.org.slug}`);
    return { isError: false, message: "Event created" };
}

export async function createOrgEventAdmin(
    _: CreateEventState,
    formData: FormData
): Promise<CreateEventState> {
    await requireRole(ROLES.admin);

    const orgId = formData.get("orgId")?.toString();
    if (!orgId) {
        return { isError: true, message: "Organization is required" };
    }

    const name = formData.get("name")?.toString().trim();
    const startDate = formData.get("startDate")?.toString();
    const endDate = formData.get("endDate")?.toString() ?? startDate;

    if (!name) {
        return { isError: true, message: "Event name is required" };
    }
    if (!startDate) {
        return { isError: true, message: "Start date is required" };
    }

    const startAt = new Date(`${startDate}T00:00:00`);
    const endAt = new Date(`${endDate}T23:59:59.999`);

    if (Number.isNaN(startAt.getTime())) {
        return { isError: true, message: "Invalid start date" };
    }
    if (Number.isNaN(endAt.getTime())) {
        return { isError: true, message: "Invalid end date" };
    }
    if (endAt < startAt) {
        return {
            isError: true,
            message: "End date must be on or after start date",
        };
    }

    try {
        await orgEventsRepository.create({
            orgId,
            name,
            startAt,
            endAt,
        });
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create event",
        };
    }

    const slug = formData.get("slug")?.toString();
    if (slug) {
        revalidatePath(`/admin/organizations/${slug}`);
    }
    revalidatePath("/admin/organizations");
    return { isError: false, message: "Event created" };
}

export async function updateOrgEventAdmin(
    _: CreateEventState,
    formData: FormData
): Promise<CreateEventState> {
    await requireRole(ROLES.admin);

    const eventId = formData.get("eventId")?.toString();
    const orgId = formData.get("orgId")?.toString();
    if (!eventId || !orgId) {
        return {
            isError: true,
            message: "Event and organization are required",
        };
    }

    const name = formData.get("name")?.toString().trim();
    const startDate = formData.get("startDate")?.toString();
    const endDate = formData.get("endDate")?.toString() ?? startDate;

    if (!name) {
        return { isError: true, message: "Event name is required" };
    }
    if (!startDate) {
        return { isError: true, message: "Start date is required" };
    }

    const startAt = new Date(`${startDate}T00:00:00`);
    const endAt = new Date(`${endDate}T23:59:59.999`);

    if (Number.isNaN(startAt.getTime())) {
        return { isError: true, message: "Invalid start date" };
    }
    if (Number.isNaN(endAt.getTime())) {
        return { isError: true, message: "Invalid end date" };
    }
    if (endAt < startAt) {
        return {
            isError: true,
            message: "End date must be on or after start date",
        };
    }

    try {
        const updated = await orgEventsRepository.update(eventId, orgId, {
            name,
            startAt,
            endAt,
        });
        if (!updated) {
            return {
                isError: true,
                message: "Event not found or access denied",
            };
        }
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update event",
        };
    }

    const slug = formData.get("slug")?.toString();
    if (slug) {
        revalidatePath(`/admin/organizations/${slug}`);
    }
    revalidatePath("/admin/organizations");
    return { isError: false, message: "Event updated" };
}

export async function deleteOrgEventAdmin(
    eventId: string,
    orgId: string,
    slug: string
): Promise<CreateEventState> {
    await requireRole(ROLES.admin);

    if (!eventId || !orgId) {
        return {
            isError: true,
            message: "Event and organization are required",
        };
    }

    try {
        const deleted = await orgEventsRepository.delete(eventId, orgId);
        if (!deleted) {
            return {
                isError: true,
                message: "Event not found or access denied",
            };
        }
    } catch (error) {
        return {
            isError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to delete event",
        };
    }

    revalidatePath(`/admin/organizations/${slug}`);
    revalidatePath("/admin/organizations");
    return { isError: false, message: "Event deleted" };
}
