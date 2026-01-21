"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLiveData } from "../../hooks/useLiveData";
import { useDriverSelection } from "../../hooks/useDriverSelection";
import { FEATURE_FLAGS } from "../../config/feature-flags";
import { DriverSelect } from "./driver-select";
import { PositionTimeCard } from "./position-time-card";
import { formatBestTime, formatClassPosition } from "../shared/time-utils";
import { RunStatisticsCard } from "./run-statistics-card";
import { ClassTimesVisualization } from "./class-times-visualization";
import { TimesDistributionChart } from "./times-distribution-chart";
import { RunPositionChart } from "./run-position-chart";

export function MyStats() {
    const {
        featureFlags,
        getAllDrivers,
        findDriverInClassResults,
        findDriverInPaxResults,
        findDriverInRawResults,
        classResultsMap,
    } = useLiveData();

    const allDrivers = getAllDrivers();
    const { selectedDriverId, selectedDriver, setSelectedDriverId } =
        useDriverSelection(allDrivers);
    const searchParams = useSearchParams();

    // Handle driver selection from URL parameter
    useEffect(() => {
        const driverParam = searchParams.get("driver");
        if (driverParam && allDrivers.some((d) => d.id === driverParam)) {
            setSelectedDriverId(driverParam);
        }
    }, [searchParams, allDrivers, setSelectedDriverId]);

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
                        {classResult && (
                            <PositionTimeCard
                                title="Class"
                                position={formatClassPosition(
                                    classResult.classPosition.position,
                                    classResult.isTrophy
                                )}
                                time={formatBestTime(classResult)}
                                timeLabel="Best Time"
                                gapToFirst={classResult.classPosition.toFirst}
                            />
                        )}

                        {rawResult && (
                            <PositionTimeCard
                                title="Raw"
                                position={rawResult.rawPosition.position}
                                time={formatBestTime(rawResult)}
                                gapToFirst={rawResult.rawPosition.toFirst}
                            />
                        )}

                        {paxResult &&
                            featureFlags[FEATURE_FLAGS.PAX_ENABLED] && (
                                <PositionTimeCard
                                    title="PAX"
                                    position={
                                        paxResult.indexedPosition.position
                                    }
                                    time={paxResult.indexedTotalTime?.toFixed(
                                        3
                                    )}
                                    gapToFirst={
                                        paxResult.indexedPosition.toFirst
                                    }
                                />
                            )}

                        <RunStatisticsCard
                            classResult={classResult}
                            rawResult={rawResult}
                        />
                    </div>

                    {classResult &&
                        (() => {
                            const driverClass = classResult.class;
                            let classTitle: string;

                            if (driverClass.startsWith("P")) {
                                classTitle = "Pro";
                            } else if (driverClass.startsWith("N")) {
                                classTitle = "Novice";
                            } else {
                                // Get the longName from class data
                                const classData =
                                    classResultsMap?.get(driverClass);
                                classTitle = classData?.longName || driverClass;
                            }

                            return (
                                <div className="grid gap-6 lg:grid-cols-3">
                                    <div className="rounded-lg border p-3 sm:p-4">
                                        <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
                                            {classTitle}
                                        </h3>
                                        <ClassTimesVisualization
                                            classResult={classResult}
                                            selectedDriverId={selectedDriverId!}
                                        />
                                    </div>
                                    <div className="rounded-lg border p-3 sm:p-4">
                                        <RunPositionChart
                                            selectedDriverId={selectedDriverId!}
                                            classResult={classResult}
                                        />
                                    </div>
                                    <div className="rounded-lg border p-3 sm:p-4">
                                        <TimesDistributionChart
                                            selectedDriverId={selectedDriverId!}
                                        />
                                    </div>
                                </div>
                            );
                        })()}
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
