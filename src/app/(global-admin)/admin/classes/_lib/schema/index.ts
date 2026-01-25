import z from "zod";

export const newBaseClassSchema = z
    .object({
        shortName: z.string().min(1, "Short Name is required"),
        longName: z.string().min(1, "Long Name is required"),
        classTypeKey: z.string().optional(),
        classCategoryId: z.string().optional(),
        isIndexed: z.boolean().default(true),
        indexValue: z.coerce
            .number()
            .max(1, "Index Value must be less than or equal to 1")
            .min(0, "Index Value must be greater than or equal to 0")
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isIndexed && !data.indexValue) {
            ctx.addIssue({
                code: "custom",
                message: "Index Value is required when Is Indexed is true",
            });
        }
    });

export const updateBaseClassSchema = newBaseClassSchema.extend({
    isEnabled: z.boolean(),
});
