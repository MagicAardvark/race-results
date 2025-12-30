"use client";

import Link from "next/link";
import type { DisplayMode } from "../../types";
import { useLiveData } from "../../hooks/useLiveData";
import { ClassResultsEntry } from "./class-results-entry";

type IndividualClassResultsProps = {
    className: string;
    displayMode: DisplayMode;
};

export const IndividualClassResults = ({
    className,
    displayMode,
}: IndividualClassResultsProps) => {
    const { classResults } = useLiveData();
    const results = classResults?.[className] ?? null;

    if (!results) {
        return null;
    }

    const entries = results.map((entry) => {
        const uniqueKey = `${className}-${entry.position}-${entry.number}-${entry.name}`;
        
        return (
            <ClassResultsEntry
                key={uniqueKey}
                entry={entry}
                allEntries={results}
                displayMode={displayMode}
            />
        );
    });

    return (
        <div id={className} className="space-y-2">
            <h2 className="cursor-pointer p-2 text-center text-lg font-bold tracking-widest">
                <Link href={`#${className}`} className="hover:underline">
                    {className}
                </Link>
            </h2>
            <div className="space-y-2">{entries}</div>
        </div>
    );
};

