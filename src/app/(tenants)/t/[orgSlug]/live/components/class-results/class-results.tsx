"use client";

import { useState } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { ClassLinks } from "./class-links";
import { IndividualClassResults } from "./individual-class-results";
import { EmptyState } from "../shared/empty-state";

export const ClassResults = () => {
    const { classResults, classNames, displayMode } = useLiveData();
    const [filteredClasses, setFilteredClasses] = useState<string[]>([]);

    if (!classResults) {
        return <EmptyState message="No results available" />;
    }

    const handleFilteredClasses = (toggleClass: string) => {
        setFilteredClasses((prev) => {
            const index = prev.indexOf(toggleClass);
            if (index === -1) {
                return [...prev, toggleClass];
            }
            return prev.filter((c) => c !== toggleClass);
        });
    };

    const clearFilteredClasses = () => {
        setFilteredClasses([]);
    };

    const classResultsElements = classNames
        .filter((classKey) => {
            // Hide elements that are not selected filters
            return filteredClasses.length === 0 || filteredClasses.includes(classKey);
        })
        .map((classKey) => (
            <IndividualClassResults
                key={classKey}
                className={classKey}
                displayMode={displayMode}
            />
        ));

    return (
        <div>
            <ClassLinks
                classes={classNames}
                filteredClasses={filteredClasses}
                toggleFilter={handleFilteredClasses}
                clearFilters={clearFilteredClasses}
            />
            <div className="mt-4 space-y-4">{classResultsElements}</div>
        </div>
    );
};

