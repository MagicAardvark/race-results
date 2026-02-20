import {
    toTitleCase,
    toUpperCase,
} from "@/app/(global-admin)/admin/(organization)/class-groups/_lib/utils";
import z from "zod";

export const createClassGroupSchema = z.object({
    shortName: z
        .string()
        .min(1, "Short Name is required")
        .transform((val) => toUpperCase(val)),
    longName: z
        .string()
        .min(1, "Long Name is required")
        .transform((val) => toTitleCase(val)),
    identificationMode: z
        .enum(["BASE_CLASS_ONLY", "GROUP_PLUS_BASE_CLASS"])
        .optional()
        .default("BASE_CLASS_ONLY"),
    classIds: z
        .array(z.union([z.string(), z.null(), z.undefined()]))
        .optional()
        .default([])
        .transform((arr) =>
            (arr || []).filter(
                (id): id is string => typeof id === "string" && id.length > 0
            )
        ),
});

export const updateClassGroupSchema = z.object({
    shortName: z
        .string()
        .min(1, "Short Name is required")
        .transform((val) => toUpperCase(val)),
    longName: z
        .string()
        .min(1, "Long Name is required")
        .transform((val) => toTitleCase(val)),
    identificationMode: z
        .enum(["BASE_CLASS_ONLY", "GROUP_PLUS_BASE_CLASS"])
        .optional()
        .default("BASE_CLASS_ONLY"),
    classIds: z
        .array(z.union([z.string(), z.null(), z.undefined()]))
        .optional()
        .default([])
        .transform((arr) =>
            (arr || []).filter(
                (id): id is string => typeof id === "string" && id.length > 0
            )
        ),
    classGroupId: z.string().uuid(),
    isEnabled: z.boolean(),
});
