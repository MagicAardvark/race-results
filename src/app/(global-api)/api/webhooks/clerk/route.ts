import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { usersRepository } from "@/db/repositories/users.repo";

/**
 * Primary email from Clerk user webhook payload (snake_case per https://clerk.com/docs/webhooks/overview).
 */
function getPrimaryEmail(data: {
    email_addresses?: Array<{ id: string; email_address: string }>;
    primary_email_address_id?: string | null;
}): string | null {
    const emails = data.email_addresses;
    if (!emails?.length) return null;
    const primary = data.primary_email_address_id
        ? emails.find((e) => e.id === data.primary_email_address_id)
        : null;
    return (primary ?? emails[0])?.email_address ?? null;
}

export async function POST(req: Request) {
    // Get the Svix headers for verification
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occurred -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occurred", {
            status: 400,
        });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, first_name, last_name } = evt.data;
        const primaryEmail = getPrimaryEmail(evt.data);

        const displayName =
            first_name && last_name
                ? `${first_name.trim()} ${last_name.trim()[0]}`.trim()
                : first_name || last_name || primaryEmail || undefined;

        try {
            await usersRepository.create(id, displayName, {
                firstName: first_name ?? null,
                lastName: last_name ?? null,
                email: primaryEmail,
            });
        } catch (error) {
            console.error("Error creating user from webhook:", error);
            // Don't return error - webhook should still return 200
            // to prevent Clerk from retrying
        }
    }

    if (eventType === "user.updated") {
        const { id, first_name, last_name } = evt.data;
        const primaryEmail = getPrimaryEmail(evt.data);

        try {
            const existing = await usersRepository.findByAuthProviderId(id);
            if (existing) {
                await usersRepository.update(existing.userId, {
                    displayName:
                        first_name && last_name
                            ? `${first_name.trim()} ${last_name.trim()[0]}`.trim()
                            : first_name || last_name || undefined,
                    firstName: first_name ?? null,
                    lastName: last_name ?? null,
                    email: primaryEmail,
                });
            }
        } catch (error) {
            console.error("Error updating user from webhook:", error);
        }
    }

    return new Response("", { status: 200 });
}
