export function getEffectiveDateRangeForYear(year: number): {
    effectiveFrom: Date;
    effectiveTo: Date;
} {
    const effectiveFrom = new Date(`${year}-01-01T00:00:00-05:00`);
    const effectiveTo = new Date(`${year}-12-31T23:59:59-05:00`);
    return { effectiveFrom, effectiveTo };
}
