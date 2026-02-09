import z from "zod";

export const createSeasonSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        startAt: z.coerce.date({
            error: "Start date is required and must be a valid date",
        }),
        endAt: z.coerce.date({
            error: "End date must be a valid date",
        }),
    })
    .superRefine((data, ctx) => {
        if (data.endAt < data.startAt) {
            ctx.addIssue({
                code: "custom",
                path: ["endAt"],
                message: "End date must be on or after start date",
            });
        }
    });
