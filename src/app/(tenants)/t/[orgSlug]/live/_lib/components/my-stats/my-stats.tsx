"use client";

import { useLiveData } from "../../hooks/useLiveData";
import { useDriverSelection } from "../../hooks/useDriverSelection";
import { FEATURE_FLAGS } from "../../config/feature-flags";
import { DriverSelect } from "./driver-select";
import { PositionTimeCard } from "./position-time-card";
import { formatBestTime, formatClassPosition } from "../shared/time-utils";
import { RunStatisticsCard } from "./run-statistics-card";
import { ClassTimesVisualization } from "./class-times-visualization";
import { TimesDistributionChart } from "./times-distribution-chart";

export function MyStats() {
    const {
        featureFlags,
        getAllDrivers,
        findDriverInClassResults,
        findDriverInPaxResults,
        findDriverInRawResults,
    } = useLiveData();

    const allDrivers = getAllDrivers();
    const { selectedDriverId, selectedDriver, setSelectedDriverId } =
        useDriverSelection(allDrivers);

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
