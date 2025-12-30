"use client";

import { useLiveResults } from "../context/live-results-context";

/**
 * Hook to access live results data
 */
export function useLiveData() {
    const context = useLiveResults();

    return {
        classResults: context.classResults,
        paxResults: context.paxResults,
        rawResults: context.rawResults,
        runWork: context.runWork,
        displayMode: context.displayMode,
        classNames: context.classResults ? Object.keys(context.classResults) : [],
    };
}

