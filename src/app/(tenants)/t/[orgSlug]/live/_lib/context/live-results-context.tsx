"use client";

import { createContext, useContext, useMemo } from "react";
import type {
    ProcessedLiveClassResults,
    ProcessedLiveIndexResults,
    ProcessedLiveRawResults,
} from "@/dto/live-results";
import type { DisplayMode, RunWork } from "../types";

type LiveResultsData = {
    classResults: ProcessedLiveClassResults | null;
    paxResults: ProcessedLiveIndexResults | null;
    rawResults: ProcessedLiveRawResults | null;
    runWork: RunWork | null;
    displayMode: DisplayMode;
    featureFlags: Record<string, boolean>;
};

const LiveResultsContext = createContext<LiveResultsData | null>(null);

// Stable empty object for default featureFlags
const EMPTY_FEATURE_FLAGS: Record<string, boolean> = {};

type LiveResultsProviderProps = {
    classResults: ProcessedLiveClassResults | null;
    paxResults: ProcessedLiveIndexResults | null;
    rawResults: ProcessedLiveRawResults | null;
    runWork: RunWork | null;
    displayMode: DisplayMode;
    featureFlags?: Record<string, boolean>;
    children: React.ReactNode;
};

export function LiveResultsProvider({
    classResults,
    paxResults,
    rawResults,
    runWork,
    displayMode,
    featureFlags = EMPTY_FEATURE_FLAGS,
    children,
}: LiveResultsProviderProps) {
    const value = useMemo(
        () => ({
            classResults,
            paxResults,
            rawResults,
            runWork,
            displayMode,
            featureFlags,
        }),
        [
            classResults,
            paxResults,
            rawResults,
            runWork,
            displayMode,
            featureFlags,
        ]
    );

    return (
        <LiveResultsContext.Provider value={value}>
            {children}
        </LiveResultsContext.Provider>
    );
}

export function useLiveResults() {
    const context = useContext(LiveResultsContext);

    if (!context) {
        throw new Error(
            "useLiveResults must be used within a LiveResultsProvider"
        );
    }

    return context;
}
