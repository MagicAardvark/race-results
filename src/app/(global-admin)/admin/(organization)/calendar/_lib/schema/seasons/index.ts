import z from "zod";

export const createSeasonSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        startDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-MM-dd)"),
        endDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-MM-dd)"),
    })
    .superRefine((data, ctx) => {
        if (data.endDate < data.startDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date must be on or after start date",
            });
        }
    });
