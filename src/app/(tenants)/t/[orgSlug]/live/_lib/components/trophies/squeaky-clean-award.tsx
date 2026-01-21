"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Sparkles } from "lucide-react";
import { RunData } from "../shared/run-data";
import { useLiveData } from "../../hooks/useLiveData";
import { createDriverKey } from "./helpers";

type SqueakyCleanAwardProps = {
    winners: Array<{
        name: string;
        number: string;
        car: string;
        class: string;
    }>;
};

export function SqueakyCleanAward({ winners }: SqueakyCleanAwardProps) {
    const { findDriverInRawResults, createDriverId } = useLiveData();
    const [expandedDriver, setExpandedDriver] = useState<string | null>(null);

    if (winners.length === 0) return null;

    return (
        <Card className="overflow-hidden sm:col-span-2">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">
                                Squeaky Clean
                            </CardTitle>
                            <span className="text-muted-foreground text-base font-normal">
                                ({winners.length}{" "}
                                {winners.length === 1 ? "driver" : "drivers"})
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                            Drivers who completed all runs with no DNFs, no
                            cones, and no penalties
                        </p>
                    </div>
                    <Sparkles className="h-6 w-6 text-blue-500" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {winners.map((winner) => {
                        const driverId = createDriverId({
                            name: winner.name,
                            number: winner.number,
                            carClass: winner.class,
                        });
                        const entry =
                            findDriverInRawResults(driverId) ?? undefined;
                        const driverKey = createDriverKey(
                            winner.name,
                            winner.number,
                            winner.class
                        );
                        const isExpanded = expandedDriver === driverKey;

                        return (
                            <Card key={driverKey} className="overflow-hidden">
                                <button
                                    onClick={() =>
                                        setExpandedDriver(
                                            isExpanded ? null : driverKey
                                        )
                                    }
                                    className="w-full text-left"
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">
                                            {winner.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-muted-foreground text-xs">
                                            #{winner.number} • {winner.car}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            Class {winner.class}
                                        </p>
                                    </CardContent>
                                </button>
                                {isExpanded && entry && (
                                    <div className="border-t px-4 pt-2 pb-4">
                                        <RunData entry={entry} />
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
