import { z } from "zod";

const RawRunStatusValues = [
    "clean",
    "dirty",
    "dnf",
    "dsq",
    "out",
    "off",
] as const;

export const RawRunStatusSchema = z.enum(RawRunStatusValues);
export const RawRunTimeSchema = z.number().nonnegative();
export const RawRunPenaltySchema = z.number().nonnegative();
export const RawRunDataSchema = z.tuple([
    RawRunTimeSchema,
    RawRunPenaltySchema,
    RawRunStatusSchema,
]);
export const RawRunSegmentSchema = z.array(RawRunDataSchema);

export const LiveResultsSnapshotSchema = z.array(
    z.object({
        msrId: z.string(),
        class: z.string(),
        carNumber: z.string(),
        driverName: z.string(),
        carModel: z.string(),
        carColor: z.string(),
        sponsor: z.string(),
        runs: z.array(RawRunSegmentSchema),
    })
);

export type RawRunStatus = z.infer<typeof RawRunStatusSchema>;
export type RawRunSegment = z.infer<typeof RawRunSegmentSchema>;
export type RawRunData = z.infer<typeof RawRunDataSchema>;
export type LiveResultsSnapshot = z.infer<typeof LiveResultsSnapshotSchema>;
