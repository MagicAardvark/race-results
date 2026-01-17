import { LIVE_RESULTS_CONFIG } from "@/constants/live-results";

export const getCacheKey = (
    orgSlug: string,
    key: keyof typeof LIVE_RESULTS_CONFIG.CACHE_KEYS
) => {
    return `${orgSlug}:${LIVE_RESULTS_CONFIG.CACHE_KEYS[key]}`;
};
