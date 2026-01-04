/**
 * Calculates the 70th percentile time and returns the max gap
 * Used for scaling gap displays in results
 */
export function calculateMaxGapFromTimes(times: number[]): number {
    if (times.length === 0) return 3.0;

    const sorted = [...times].sort((a, b) => a - b);
    const percentile70Index = Math.ceil(sorted.length * 0.7) - 1;
    const percentile70Time = sorted[Math.max(0, percentile70Index)] || 0;
    const fastestTime = sorted[0] || 0;

    return Math.max(percentile70Time - fastestTime, 0.1);
}

