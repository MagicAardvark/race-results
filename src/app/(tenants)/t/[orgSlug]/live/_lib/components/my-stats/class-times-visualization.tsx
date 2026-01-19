"use client";

import { useMemo } from "react";
import type { ResultsEntry } from "@/dto/live-results";
import { useLiveData } from "../../hooks/useLiveData";
import { formatClassPosition } from "../shared/time-utils";

type ClassTimesVisualizationProps = {
    classResult: ResultsEntry;
    selectedDriverId: string;
};

export function ClassTimesVisualization({
    classResult,
    selectedDriverId,
}: ClassTimesVisualizationProps) {
    const { classResultsMap, createDriverId } = useLiveData();
    // Get all drivers in the same class
    const classDrivers = useMemo(() => {
        if (!classResultsMap || !classResult) return [];

        // Determine the class key to use - if class starts with P or N, use the grouped key
        const driverClass = classResult.class;
        let classKey = driverClass;
        if (driverClass.startsWith("P")) {
            classKey = "P";
        } else if (driverClass.startsWith("N")) {
            classKey = "N";
        }

        // Find the class data for this driver's class
        const classData = classResultsMap.get(classKey);
        if (!classData) return [];

        return classData.entries
            .map((driver) => {
                const driverId = createDriverId({
                    name: driver.driverName,
                    number: driver.carNumber,
                    carClass: driver.class,
                });

                // Get best time - rawTotalTime already includes penalties and is the best time
                const time = driver.rawTotalTime ?? null;

                return {
                    driverId,
                    name: driver.driverName,
                    number: driver.carNumber,
                    time,
                    position: formatClassPosition(
                        driver.classPosition.position,
                        driver.isTrophy
                    ),
                    isSelected: driverId === selectedDriverId,
                };
            })
            .filter(
                (d): d is typeof d & { time: number } =>
                    d.time != null && !isNaN(d.time)
            )
            .sort((a, b) => a.time - b.time);
    }, [classResult, classResultsMap, selectedDriverId, createDriverId]);

    if (classDrivers.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">No times available</p>
        );
    }

    const fastestTime = classDrivers[0]?.time || 0;

    return (
        <div className="space-y-2">
            {classDrivers.map((driver) => {
                const timeDiff = driver.time - fastestTime;

                return (
                    <div
                        key={driver.driverId}
                        className={`relative flex items-center gap-3 rounded-md p-2 transition-colors ${
                            driver.isSelected
                                ? "bg-primary/10 border-primary border-2"
                                : ""
                        }`}
                    >
                        <div className="flex w-12 shrink-0 items-center justify-center text-xs font-semibold">
                            {driver.position}
                        </div>
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                            <div className="flex min-w-0 shrink-0 flex-col text-xs">
                                <span
                                    className={`font-medium ${driver.isSelected ? "text-primary" : ""}`}
                                >
                                    {driver.name}
                                </span>
                                <span className="text-muted-foreground">
                                    #{driver.number}
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 font-mono text-sm">
                                <span
                                    className={
                                        driver.isSelected
                                            ? "text-primary font-bold"
                                            : ""
                                    }
                                >
                                    {driver.time.toFixed(3)}
                                </span>
                                {timeDiff > 0 && (
                                    <span className="text-muted-foreground text-xs">
                                        +{timeDiff.toFixed(3)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
