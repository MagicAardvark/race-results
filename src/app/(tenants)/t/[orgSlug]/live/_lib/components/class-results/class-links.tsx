"use client";

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
    return (
        <FilterButtons
            items={classes}
            selectedItems={filteredClasses}
            onToggle={toggleFilter}
            onClear={clearFilters}
            showClear
        />
    );
};

