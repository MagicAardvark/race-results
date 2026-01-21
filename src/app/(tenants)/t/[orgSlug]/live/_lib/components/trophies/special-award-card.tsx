"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import type { LucideIcon } from "lucide-react";
import { RunData } from "../shared/run-data";
import type { ResultsEntry } from "@/dto/live-results";
import type { SpecialAwards, SpecialAwardType } from "./types";

// Exclude squeakyClean since it's an array, not a single award object
type SingleAwardType = Exclude<SpecialAwardType, "squeakyClean">;
type SingleAward = NonNullable<SpecialAwards[SingleAwardType]>;

type SpecialAwardCardProps = {
    awardType: SingleAwardType;
    award: SingleAward;
    icon: LucideIcon;
    iconColor: string;
    title: string;
    description: string;
    entry: ResultsEntry | undefined;
    renderStats: (award: SingleAward) => React.ReactNode;
};

export function SpecialAwardCard({
    award,
    icon: Icon,
    iconColor,
    title,
    description,
    entry,
    renderStats,
}: SpecialAwardCardProps) {
    const [showRuns, setShowRuns] = useState(false);

    return (
        <Card className="overflow-hidden">
            <button
                onClick={() => setShowRuns((prev) => !prev)}
                className="w-full text-left"
            >
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {description}
                            </p>
                        </div>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                    <div>
                        <p className="text-lg font-semibold">{award.name}</p>
                        <p className="text-muted-foreground text-sm">
                            #{award.number} • {award.car}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Class {award.class}
                        </p>
                    </div>
                    <div className="border-t pt-3">{renderStats(award)}</div>
                </CardContent>
            </button>
            {showRuns && entry && (
                <div className="border-t px-4 pt-2 pb-4">
                    <RunData entry={entry} />
                </div>
            )}
        </Card>
    );
}
