"use client";

import { Zap, Target, TrendingUp, Gauge } from "lucide-react";
import { SpecialAwardCard } from "./special-award-card";
import { SqueakyCleanAward } from "./squeaky-clean-award";
import { useLiveData } from "../../hooks/useLiveData";
import type { SpecialAwards } from "./types";

type SpecialAwardsViewProps = {
    specialAwards: SpecialAwards;
};

export function SpecialAwardsView({ specialAwards }: SpecialAwardsViewProps) {
    const { findDriverInRawResults, createDriverId } = useLiveData();

    const findEntryByDriver = (driver: {
        name: string;
        number: string;
        class: string;
    }) => {
        const driverId = createDriverId({
            name: driver.name,
            number: driver.number,
            carClass: driver.class,
        });
        return findDriverInRawResults(driverId) ?? undefined;
    };
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Shoutouts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
                {specialAwards.speedDemon && (
                    <SpecialAwardCard
                        awardType="speedDemon"
                        award={specialAwards.speedDemon}
                        icon={Gauge}
                        iconColor="text-red-600"
                        title="Speed Demon"
                        description="Fastest single run time overall"
                        entry={findEntryByDriver(specialAwards.speedDemon)}
                        renderStats={(award) => {
                            const speedDemonAward = award as NonNullable<
                                SpecialAwards["speedDemon"]
                            >;
                            return (
                                <>
                                    <p className="text-muted-foreground text-xs">
                                        Fastest Time
                                    </p>
                                    <p className="font-mono text-2xl font-bold">
                                        {speedDemonAward.fastestTime.toFixed(3)}
                                    </p>
                                </>
                            );
                        }}
                    />
                )}

                {specialAwards.consistencyKing && (
                    <SpecialAwardCard
                        awardType="consistencyKing"
                        award={specialAwards.consistencyKing}
                        icon={TrendingUp}
                        iconColor="text-green-600"
                        title="Consistency King/Queen"
                        description="Most consistent times across all runs"
                        entry={findEntryByDriver(specialAwards.consistencyKing)}
                        renderStats={(award) => {
                            const consistencyAward = award as NonNullable<
                                SpecialAwards["consistencyKing"]
                            >;
                            return (
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-muted-foreground text-xs">
                                            Avg Time
                                        </p>
                                        <p className="font-mono text-xl font-bold">
                                            {consistencyAward.avgTime.toFixed(
                                                3
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">
                                            Time Spread
                                        </p>
                                        <p className="font-mono text-xl font-bold">
                                            {consistencyAward.variance.toFixed(
                                                3
                                            )}
                                            s
                                        </p>
                                    </div>
                                </div>
                            );
                        }}
                    />
                )}

                {specialAwards.hailMary && (
                    <SpecialAwardCard
                        awardType="hailMary"
                        award={specialAwards.hailMary}
                        icon={Target}
                        iconColor="text-primary"
                        title="Hail Mary"
                        description="Biggest outlier run (fastest vs second fastest)"
                        entry={findEntryByDriver(specialAwards.hailMary)}
                        renderStats={(award) => {
                            const hailMaryAward = award as NonNullable<
                                SpecialAwards["hailMary"]
                            >;
                            return (
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-muted-foreground text-xs">
                                            Fastest Run
                                        </p>
                                        <p className="font-mono text-xl font-bold">
                                            {hailMaryAward.fastestRun.toFixed(
                                                3
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">
                                            Outlier Gap
                                        </p>
                                        <p className="font-mono text-xl font-bold">
                                            {hailMaryAward.outlierGap.toFixed(
                                                3
                                            )}
                                            s
                                        </p>
                                    </div>
                                </div>
                            );
                        }}
                    />
                )}

                {specialAwards.coneKiller && (
                    <SpecialAwardCard
                        awardType="coneKiller"
                        award={specialAwards.coneKiller}
                        icon={Zap}
                        iconColor="text-yellow-500"
                        title="Cone Killer"
                        description="Highest total number of cones hit"
                        entry={findEntryByDriver(specialAwards.coneKiller)}
                        renderStats={(award) => {
                            const coneKillerAward = award as NonNullable<
                                SpecialAwards["coneKiller"]
                            >;
                            return (
                                <>
                                    <p className="text-muted-foreground text-xs">
                                        Total Cones
                                    </p>
                                    <p className="font-mono text-2xl font-bold">
                                        {coneKillerAward.totalCones}
                                    </p>
                                </>
                            );
                        }}
                    />
                )}

                {specialAwards.squeakyClean.length > 0 && (
                    <SqueakyCleanAward winners={specialAwards.squeakyClean} />
                )}
            </div>
        </div>
    );
}
