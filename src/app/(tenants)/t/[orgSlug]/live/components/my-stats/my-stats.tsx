"use client";

import { useEffect, useState, useMemo } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { FEATURE_FLAGS } from "../../lib/feature-flags";
import { DriverSelect } from "./driver-select";
import { ClassPositionTimeCard } from "./class-position-time-card";
import { PositionTimeCard } from "./position-time-card";
import { RunStatisticsCard } from "./run-statistics-card";
import { ClassTimesVisualization } from "./class-times-visualization";
import { TimesDistributionChart } from "./times-distribution-chart";

const STORAGE_KEY = "selected-driver-id";

export function MyStats() {
    const {
        classResults,
        paxResults,
        rawResults,
        displayMode,
        featureFlags,
        getAllDrivers,
        findDriverInClassResults,
        findDriverInPaxResults,
        findDriverInRawResults,
    } = useLiveData();
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(
        null
    );

    const allDrivers = useMemo(() => getAllDrivers(), [getAllDrivers]);

    // Load selected driver from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && allDrivers.some((d) => d.id === stored)) {
                setSelectedDriverId(stored);
            }
        }
    }, [allDrivers]);

    // Save to localStorage when selection changes
    useEffect(() => {
        if (selectedDriverId && typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, selectedDriverId);
        }
    }, [selectedDriverId]);

    const selectedDriver = allDrivers.find((d) => d.id === selectedDriverId);
    const classResult = selectedDriverId
        ? findDriverInClassResults(selectedDriverId)
        : null;
    const paxResult = selectedDriverId
        ? findDriverInPaxResults(selectedDriverId)
        : null;
    const rawResult = selectedDriverId
        ? findDriverInRawResults(selectedDriverId)
        : null;

    if (allDrivers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">
                    No drivers found in results
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!selectedDriver && (
                <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
                    <p className="text-muted-foreground">
                        Please select your name from the dropdown below to view
                        your stats.
                    </p>
                </div>
            )}

            {selectedDriver && (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                        <ClassPositionTimeCard
                            classResult={classResult}
                            rawResult={rawResult}
                        />

                        {rawResult && (
                            <PositionTimeCard
                                title="Raw"
                                position={rawResult.position}
                                time={rawResult.time}
                                gapToFirst={rawResult.toFirst}
                            />
                        )}

                        {paxResult &&
                            featureFlags[FEATURE_FLAGS.PAX_ENABLED] && (
                                <PositionTimeCard
                                    title="PAX"
                                    position={paxResult.paxPosition}
                                    time={paxResult.runInfo.paxTime}
                                    gapToFirst={paxResult.runInfo.toFirstInPax}
                                />
                            )}

                        <RunStatisticsCard
                            classResult={classResult}
                            rawResult={rawResult}
                        />
                    </div>

                    {classResult && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-lg border p-3 sm:p-4">
                                <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
                                    Class Times Visualization
                                </h3>
                                <ClassTimesVisualization
                                    classResult={classResult}
                                    selectedDriverId={selectedDriverId!}
                                />
                            </div>
                            <div className="rounded-lg border p-3 sm:p-4">
                                <TimesDistributionChart
                                    selectedDriverId={selectedDriverId!}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            <DriverSelect
                drivers={allDrivers}
                selectedDriverId={selectedDriverId}
                onDriverChange={setSelectedDriverId}
            />
        </div>
    );
}
