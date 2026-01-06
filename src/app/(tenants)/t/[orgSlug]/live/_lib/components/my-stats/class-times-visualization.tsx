"use client";

import { useMemo } from "react";
import type { ClassResult } from "../../types";
import { useLiveData } from "../../hooks/useLiveData";

type ClassTimesVisualizationProps = {
    classResult: ClassResult;
    selectedDriverId: string;
};

export function ClassTimesVisualization({
    classResult,
    selectedDriverId,
}: ClassTimesVisualizationProps) {
    const { classResults, displayMode, createDriverId } = useLiveData();
    // Get all drivers in the same class
    const classDrivers = useMemo(() => {
        if (!classResults || !classResult) return [];
        const driversInClass = classResults[classResult.carClass] || [];

        return driversInClass
            .map((driver) => {
                const driverId = createDriverId(driver);
                const time =
                    displayMode === "rallycross"
                        ? driver.runInfo.rallyCrossTime
                        : driver.runInfo.runs.find((r) => r.isBest)?.time || driver.runInfo.total;

                return {
                    driverId,
                    name: driver.name,
                    number: driver.number,
                    time,
                    position: parseInt(driver.position) || 999,
                    isSelected: driverId === selectedDriverId,
                };
            })
            .filter((d) => d.time != null && !isNaN(d.time))
            .sort((a, b) => a.time - b.time);
    }, [classResult, classResults, selectedDriverId, displayMode, createDriverId]);

    if (classDrivers.length === 0) {
        return <p className="text-sm text-muted-foreground">No times available</p>;
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
                            driver.isSelected ? "bg-primary/10 border-2 border-primary" : ""
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
                                <span className="text-muted-foreground">#{driver.number}</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 text-sm font-mono">
                                <span
                                    className={driver.isSelected ? "font-bold text-primary" : ""}
                                >
                                    {driver.time.toFixed(3)}
                                </span>
                                {timeDiff > 0 && (
                                    <span className="text-xs text-muted-foreground">
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

