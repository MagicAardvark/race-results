"use client";

import { useMemo, useCallback } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { useUrlFilters } from "../../hooks/useUrlFilters";
import { ClassLinks } from "./class-links";
import { IndividualClassResults } from "./individual-class-results";
import { EmptyState } from "../shared/empty-state";

export const ClassResults = () => {
    const { classResults, classNames } = useLiveData();
    const { getFilters, updateFilters } = useUrlFilters();

    // Get filtered classes from URL search params
    const filteredClasses = useMemo(
        () => getFilters("classes", classNames),
        [getFilters, classNames]
    );

    const handleFilteredClasses = useCallback(
        (toggleClass: string) => {
            const index = filteredClasses.indexOf(toggleClass);
            const newFilters =
                index === -1
                    ? [...filteredClasses, toggleClass]
                    : filteredClasses.filter((c) => c !== toggleClass);
            updateFilters("classes", newFilters);
        },
        [filteredClasses, updateFilters]
    );

    const clearFilteredClasses = useCallback(() => {
        updateFilters("classes", []);
    }, [updateFilters]);

    const classResultsElements = useMemo(
        () =>
            classNames
                .filter((classKey) => {
                    // Hide elements that are not selected filters
                    return (
                        filteredClasses.length === 0 ||
                        filteredClasses.includes(classKey)
                    );
                })
                .map((classKey) => (
                    <IndividualClassResults
                        key={classKey}
                        className={classKey}
                    />
                )),
        [classNames, filteredClasses]
    );

    if (!classResults) {
        return <EmptyState message="No results available" />;
    }

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
