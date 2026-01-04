"use client";

import Link from "next/link";
import { useLiveData } from "../../hooks/useLiveData";
import { getClassResultKey } from "../../utils/key-generators";
import { ClassResultsEntry } from "./class-results-entry";

type IndividualClassResultsProps = {
    className: string;
};

export const IndividualClassResults = ({ className }: IndividualClassResultsProps) => {
    const { classResults } = useLiveData();
    const results = classResults?.[className] ?? null;

    if (!results) {
        return null;
    }

    return (
        <div id={className} className="space-y-2">
            <h2 className="cursor-pointer p-2 text-center text-lg font-bold tracking-widest">
                <Link href={`#${className}`} className="hover:underline">
                    {className}
                </Link>
            </h2>
            <div className="space-y-2">
                {results.map((entry) => (
                    <ClassResultsEntry
                        key={getClassResultKey(entry, className)}
                        entry={entry}
                        allEntries={results}
                    />
                ))}
            </div>
        </div>
    );
};

