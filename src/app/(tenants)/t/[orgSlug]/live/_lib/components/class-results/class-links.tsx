"use client";

import { useLiveData } from "../../hooks/useLiveData";
import { FilterButtons } from "../shared/filter-buttons";

interface ClassLinksProps {
    classes: string[];
    filteredClasses: string[];
    toggleFilter: (c: string) => void;
    clearFilters: () => void;
}

export const ClassLinks = ({
    classes,
    filteredClasses,
    toggleFilter,
    clearFilters,
}: ClassLinksProps) => {
    const { classResultsMap } = useLiveData();

    // Map classes to tooltips with longName
    const itemTitles = classes.reduce(
        (acc, className) => {
            const classData = classResultsMap?.get(className);
            const longName = classData?.longName;
            if (longName) {
                acc[className] = longName;
            }
            return acc;
        },
        {} as Record<string, string>
    );

    return (
        <FilterButtons
            items={classes}
            selectedItems={filteredClasses}
            onToggle={toggleFilter}
            onClear={clearFilters}
            showClear
            itemTitles={itemTitles}
        />
    );
};
