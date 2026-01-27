import z from "zod";

const indexValueSchema = z.coerce
    .number()
    .max(1, "Index Value must be less than or equal to 1")
    .min(0, "Index Value must be greater than or equal to 0");

export const newBaseClassSchema = z
    .object({
        shortName: z.string().min(1, "Short Name is required"),
        longName: z.string().min(1, "Long Name is required"),
        classTypeKey: z.string().optional(),
        classCategoryId: z.string().optional(),
        isIndexed: z.boolean().default(true),
        indexValue: indexValueSchema.optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isIndexed && !data.indexValue) {
            ctx.addIssue({
                code: "custom",
                message: "Index Value is required when Is Indexed is true",
            });
        }
    });

export const updateBaseClassSchema = z.object({
    shortName: z.string().min(1, "Short Name is required"),
    longName: z.string().min(1, "Long Name is required"),
    classTypeKey: z.string().optional(),
    classCategoryId: z.string().optional(),
    isEnabled: z.boolean(),
});

export const updateIndexValueSchema = z.object({
    indexValue: indexValueSchema,
});

export const addIndexValueSchema = z.object({
    year: z.coerce
        .number()
        .min(2000, "Year must be 2000 or later")
        .max(
            new Date().getFullYear() + 1,
            "Year cannot be in the distant future"
        ),

    indexValue: indexValueSchema,
});
