"use client";

import { useLiveData } from "../../hooks/useLiveData";
import { useUrlFilters } from "../../hooks/useUrlFilters";
import { ClassLinks } from "./class-links";
import { IndividualClassResults } from "./individual-class-results";
import { EmptyState } from "../shared/empty-state";

export const ClassResults = () => {
    const { classResults, classNames } = useLiveData();
    const { getFilters, updateFilters } = useUrlFilters();

    // Get filtered classes from URL search params
    const filteredClasses = getFilters("classes", classNames);

    if (!classResults) {
        return <EmptyState message="No results available" />;
    }

    const handleFilteredClasses = (toggleClass: string) => {
        const index = filteredClasses.indexOf(toggleClass);
        const newFilters =
            index === -1
                ? [...filteredClasses, toggleClass]
                : filteredClasses.filter((c) => c !== toggleClass);
        updateFilters("classes", newFilters);
    };

    const clearFilteredClasses = () => {
        updateFilters("classes", []);
    };

    const classResultsElements = classNames
        .filter((classKey) => {
            // Hide elements that are not selected filters
            return filteredClasses.length === 0 || filteredClasses.includes(classKey);
        })
        .map((classKey) => (
            <IndividualClassResults key={classKey} className={classKey} />
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
