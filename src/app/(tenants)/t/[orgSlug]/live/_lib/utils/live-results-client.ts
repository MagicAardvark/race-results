import type {
    ProcessedLiveClassResults,
    ProcessedLiveIndexResults,
    ProcessedLiveRawResults,
} from "@/dto/live-results";
import type { RunWork } from "../types";
import { fetchJson } from "../utils/api-client";
import { LIVE_TIMING_CONFIG } from "../config/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { headers } from "next/headers";

/**
 * Helper to fetch data from either local file or API route
 *
 * Supports two modes controlled by USE_LOCAL_FILES env variable:
 * 1. Local files: Reads from filesystem when USE_LOCAL_FILES=true
 * 2. API routes: Fetches from API endpoints when USE_LOCAL_FILES is not "true"
 *
 * Authentication:
 * - Automatically forwards cookies from the incoming request
 * - Uses APP_URL, VERCEL_URL, or localhost:3000 as base URL
 */
async function fetchData<T>(urlOrPath: string): Promise<T | null> {
    // Use USE_LOCAL_FILES env variable as a toggle
    if (process.env.USE_LOCAL_FILES === "true") {
        try {
            const filePath = join(process.cwd(), urlOrPath);
            const fileContents = await readFile(filePath, "utf-8");
            return JSON.parse(fileContents) as T;
        } catch (error) {
            console.error(`Error reading local file ${urlOrPath}:`, error);
            return null;
        }
    }

    // For API routes, construct absolute URL for server-side fetching
    const baseUrl =
        process.env.APP_URL ||
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000");

    const apiUrl = urlOrPath.startsWith("/")
        ? `${baseUrl}${urlOrPath}`
        : urlOrPath;

    // Forward cookies and headers from the incoming request for authentication
    // Cookies work when calling the same domain (localhost to localhost, or same Vercel domain)
    try {
        const headersList = await headers();
        const cookie = headersList.get("cookie");
        const forwardedHeaders: HeadersInit = {};

        // Always forward cookies - they'll work for same-domain requests
        if (cookie) {
            forwardedHeaders["cookie"] = cookie;
        }

        return await fetchJson<T>(apiUrl, {
            headers: forwardedHeaders,
        });
    } catch (error) {
        console.error(`Error fetching ${apiUrl}:`, error);
        return null;
    }
}

/**
 * Fetches class results
 */
export async function getClassResults(
    orgSlug: string
): Promise<ProcessedLiveClassResults | null> {
    const url = LIVE_TIMING_CONFIG.getApiUrl(orgSlug, "class");
    return await fetchData<ProcessedLiveClassResults>(url);
}

/**
 * Fetches PAX results (indexed results)
 */
export async function getPaxResults(
    orgSlug: string
): Promise<ProcessedLiveIndexResults | null> {
    const url = LIVE_TIMING_CONFIG.getApiUrl(orgSlug, "indexed");
    return await fetchData<ProcessedLiveIndexResults>(url);
}

/**
 * Fetches raw results
 */
export async function getRawResults(
    orgSlug: string
): Promise<ProcessedLiveRawResults | null> {
    const url = LIVE_TIMING_CONFIG.getApiUrl(orgSlug, "raw");
    return await fetchData<ProcessedLiveRawResults>(url);
}

/**
 * Fetches run/work assignment data
 */
export async function getRunWork(orgSlug: string): Promise<RunWork | null> {
    const url = LIVE_TIMING_CONFIG.getApiUrl(orgSlug, "runwork");
    const data = await fetchData<RunWork>(url);
    return data ?? null;
}
