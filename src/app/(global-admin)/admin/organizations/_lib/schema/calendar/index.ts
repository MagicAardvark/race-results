import z from "zod";

export const baseEventSchema = z
    .object({
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
    });
