"use client";

import { useEffect, useState, useMemo } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { FEATURE_FLAGS } from "../../config/feature-flags";
import { DriverSelect } from "./driver-select";
import { ClassPositionTimeCard } from "./class-position-time-card";
import { PositionTimeCard } from "./position-time-card";
import { RunStatisticsCard } from "./run-statistics-card";
import { ClassTimesVisualization } from "./class-times-visualization";
import { TimesDistributionChart } from "./times-distribution-chart";

const STORAGE_KEY = "selected-driver-id";

export function MyStats() {
    const {
        featureFlags,
        getAllDrivers,
        findDriverInClassResults,
        findDriverInPaxResults,
        findDriverInRawResults,
    } = useLiveData();

    const allDrivers = useMemo(() => getAllDrivers(), [getAllDrivers]);

    // Get valid stored driver ID from localStorage
    const getStoredDriverId = () => {
        if (typeof window === "undefined" || allDrivers.length === 0) return null;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && allDrivers.some((d) => d.id === stored)) {
            return stored;
        }
        return null;
    };

    // Use state for user selection, but derive initial value from localStorage
    const [userSelectedDriverId, setUserSelectedDriverId] = useState<string | null>(null);
    
    // The actual selected driver ID: user selection takes precedence, otherwise use stored value
    const selectedDriverId = userSelectedDriverId ?? getStoredDriverId();

    // Save to localStorage when user selection changes
    useEffect(() => {
        if (userSelectedDriverId && typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, userSelectedDriverId);
        }
    }, [userSelectedDriverId]);

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
                onDriverChange={setUserSelectedDriverId}
            />
        </div>
    );
}
