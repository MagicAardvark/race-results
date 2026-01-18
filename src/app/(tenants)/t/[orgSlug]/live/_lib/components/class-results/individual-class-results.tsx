"use client";

import Link from "next/link";
import { useLiveData } from "../../hooks/useLiveData";
import { ClassResultEntry } from "./class-result-entry";

type IndividualClassResultsProps = {
    className: string;
};

export const IndividualClassResults = ({
    className,
}: IndividualClassResultsProps) => {
    const { classResultsMap } = useLiveData();
    const classData = classResultsMap?.get(className);

    if (!classData) {
        return null;
    }

    return (
        <div id={className} className="space-y-2">
            <h2 className="cursor-pointer p-2 text-center text-lg font-bold tracking-widest">
                <Link href={`#${className}`} className="hover:underline">
                    {classData.longName || className}
                </Link>
            </h2>
            <div className="space-y-2">
                {classData.entries.map((entry) => (
                    <ClassResultEntry
                        key={entry.entryKey}
                        entry={entry}
                        allEntries={classData.entries}
                    />
                ))}
            </div>
        </div>
    );
};
