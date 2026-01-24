import z from "zod";
import {
    toTitleCase,
    toUpperCase,
} from "../components/class-groups/_lib/utils";

export const createClassGroupSchema = z.object({
    shortName: z
        .string()
        .min(1, "Short Name is required")
        .transform((val) => toUpperCase(val)),
    longName: z
        .string()
        .min(1, "Long Name is required")
        .transform((val) => toTitleCase(val)),
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
