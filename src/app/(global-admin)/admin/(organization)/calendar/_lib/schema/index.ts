import z from "zod";

export const baseEventSchema = z
    .object({
        isLinkedToMsrEvent: z.boolean().default(false).optional(),
        msrEventId: z.string().optional(),
        name: z.string().min(1, "Name is required"),
        isMultiDay: z.boolean().default(false),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-MM-dd)"),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-MM-dd)"),
    })
    .superRefine((data, ctx) => {
        if (data.isMultiDay == true) {
            const startDate = new Date(data.startDate);
            const endDate = data.endDate
                ? new Date(data.endDate)
                : new Date(data.startDate);

            if (!data.endDate) {
                ctx.addIssue({
                    code: "custom",
                    path: ["endDate"],
                    message: "End date is required for multi-day events",
                });
            } else if (endDate < startDate) {
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
