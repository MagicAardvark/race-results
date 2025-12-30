"use client";

import { DisplayMode, type ClassResult } from "../../types";
import { AutocrossResultEntry } from "./autocross-result-entry";
import { RallycrossResultEntry } from "./rallycross-result-entry";

type ClassResultsEntryProps = {
    entry: ClassResult;
    allEntries: ClassResult[];
    displayMode: DisplayMode;
};

export const ClassResultsEntry = ({
    entry,
    allEntries,
    displayMode,
}: ClassResultsEntryProps) => {
    return displayMode === DisplayMode.rallycross ? (
        <RallycrossResultEntry entry={entry} allEntries={allEntries} />
    ) : (
        <AutocrossResultEntry entry={entry} allEntries={allEntries} />
    );
};

