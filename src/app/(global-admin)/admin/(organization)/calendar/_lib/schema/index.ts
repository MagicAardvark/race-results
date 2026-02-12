import z from "zod";

export const baseEventSchema = z
    .object({
        isLinkedToMsrEvent: z.boolean().default(false).optional(),
        msrEventId: z.string().optional(),
        name: z.string().min(1, "Name is required"),
        isMultiDay: z.boolean().default(false),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isMultiDay) {
            if (!data.endDate) {
                ctx.addIssue({
                    code: "custom",
                    path: ["endDate"],
                    message: "End date is required for multi-day events",
                });
            } else if (data.endDate < data.startDate) {
                ctx.addIssue({
                    code: "custom",
                    path: ["endDate"],
                    message: "End date must be on or after start date",
                });
            }
        }

        if (data.isLinkedToMsrEvent && !data.msrEventId) {
            ctx.addIssue({
                code: "custom",
                path: ["msrEventId"],
                message:
                    "An MSR event is required when linking to an MSR event",
            });
        }
    });

export const linkMsrEventSchema = z.object({
    msrEventId: z.string().min(1, "Please select an MSR event to link"),
});
