import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Medal, Award } from "lucide-react";
import type { TrophyEntry } from "./types";

type TrophyEntryCardProps = {
    entry: TrophyEntry;
    isProOrNovice: boolean;
};

function getMedalIcon(position: number) {
    if (position === 1) {
        return <Medal className="h-5 w-5 text-yellow-600" />;
    }
    if (position === 2) {
        return <Medal className="h-5 w-5 text-gray-400" />;
    }
    if (position === 3) {
        return <Medal className="h-5 w-5 text-amber-700" />;
    }
    return <Award className="text-primary h-5 w-5" />;
}

export function TrophyEntryCard({
    entry,
    isProOrNovice,
}: TrophyEntryCardProps) {
    return (
        <Card
            key={`${entry.name}-${entry.number}-${entry.class}`}
            className="relative overflow-hidden"
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        Position {entry.position}
                    </CardTitle>
                    {getMedalIcon(entry.position)}
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <p className="text-sm font-semibold">{entry.name}</p>
                    <p className="text-muted-foreground text-xs">
                        #{entry.number} • {entry.car}
                    </p>
                    {isProOrNovice && (
                        <p className="text-muted-foreground text-xs">
                            Class {entry.class}
                        </p>
                    )}
                </div>

                <div className="border-t pt-2">
                    <div className="flex items-baseline gap-4">
                        <div>
                            <p className="text-muted-foreground text-xs">Raw</p>
                            <p className="font-mono text-base font-bold">
                                {entry.rawTime}
                            </p>
                        </div>
                        {isProOrNovice && (
                            <div>
                                <p className="text-muted-foreground text-xs">
                                    PAX
                                </p>
                                <p className="font-mono text-base font-bold">
                                    {entry.paxTime || "N/A"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
