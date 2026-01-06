"use client";

import { FilterButtons } from "../shared/filter-buttons";

interface WorkRunFilterProps {
    classes: string[];
    selectedClass: string;
    handleSelectClass: (c: string) => void;
}

export const WorkRunFilter = ({
    classes,
    selectedClass,
    handleSelectClass,
}: WorkRunFilterProps) => {
    return (
        <FilterButtons
            items={classes}
            selectedItems={selectedClass ? [selectedClass] : []}
            onToggle={handleSelectClass}
        />
    );
};

