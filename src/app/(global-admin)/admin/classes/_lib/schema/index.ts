import z from "zod";

export const newBaseClassSchema = z.object({
    shortName: z.string().min(1, "Short Name is required"),
    longName: z.string().min(1, "Long Name is required"),
    classTypeKey: z.string().optional(),
    classCategoryId: z.string().optional(),
});

export const updateBaseClassSchema = newBaseClassSchema.extend({
    isEnabled: z.boolean(),
});
