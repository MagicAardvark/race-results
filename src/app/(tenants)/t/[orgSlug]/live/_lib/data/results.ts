import type {
    ClassResult,
    ClassResultsJson,
    PaxResultsJson,
    RawResult,
    RawResultsJson,
    RunWork,
} from "../types";
import { DisplayMode } from "../types";
import { fetchJson } from "../utils/api-client";
import { LIVE_TIMING_CONFIG } from "../config/config";
import { processClassResults } from "../utils/rallycross-calculator";

/**
 * Fetches and processes class results
 */
export async function getClassResults(
    displayMode: DisplayMode = DisplayMode.autocross
): Promise<Record<string, ClassResult[]> | null> {
    const data = await fetchJson<ClassResultsJson>(
        LIVE_TIMING_CONFIG.api.classResults
    );

    if (!data?.results) {
        return null;
    }

    return processClassResults(data.results, displayMode);
}

/**
 * Fetches PAX results
 */
export async function getPaxResults(): Promise<ClassResult[] | null> {
    const data = await fetchJson<PaxResultsJson>(
        LIVE_TIMING_CONFIG.api.paxResults
    );

    return data?.results ?? null;
}

/**
 * Fetches raw results
 */
export async function getRawResults(): Promise<RawResult[] | null> {
    const data = await fetchJson<RawResultsJson>(
        LIVE_TIMING_CONFIG.api.rawResults
    );

    return data?.results ?? null;
}

/**
 * Fetches run/work assignment data
 */
export async function getRunWork(): Promise<RunWork | null> {
    const data = await fetchJson<RunWork>(LIVE_TIMING_CONFIG.api.runWork);

    return data ?? null;
}
