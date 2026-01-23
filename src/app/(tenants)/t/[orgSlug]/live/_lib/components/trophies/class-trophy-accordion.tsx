"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Trophy, ChevronDown } from "lucide-react";
import { TrophyEntryCard } from "./trophy-entry-card";
import type { TrophyClassData } from "./types";

type ClassTrophyAccordionProps = {
    trophyData: TrophyClassData[];
};

export function ClassTrophyAccordion({
    trophyData,
}: ClassTrophyAccordionProps) {
    // Derive the default open class from trophyData
    const defaultOpenClass = useMemo(
        () => (trophyData.length > 0 ? trophyData[0].className : null),
        [trophyData]
    );

    // Track user's manual selection
    const [userSelectedClass, setUserSelectedClass] = useState<string | null>(
        null
    );
    const hasUserInteracted = userSelectedClass !== null;

    // Use default if user hasn't interacted, otherwise use user's selection
    const openClass = hasUserInteracted ? userSelectedClass : defaultOpenClass;

    const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const isInitialMount = useRef(true);

    // Scroll to top when accordion opens with offset (but not on initial load)
    useEffect(() => {
        // Skip scroll on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only scroll if user has interacted (clicked to open/close)
        if (
            hasUserInteracted &&
            openClass &&
            accordionRefs.current[openClass]
        ) {
            const element = accordionRefs.current[openClass];
            if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition =
                    elementPosition + window.pageYOffset - 70;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        }
    }, [openClass, hasUserInteracted]);

    const handleToggle = (className: string) => {
        setUserSelectedClass(openClass === className ? null : className);
    };

    return (
        <div className="space-y-2">
            {trophyData.map((classData) => {
                const isOpen = openClass === classData.className;
                const isProOrNovice =
                    classData.className === "P" || classData.className === "N";

                return (
                    <Card
                        key={classData.className}
                        className={`overflow-hidden ${
                            isOpen ? "bg-orange-50 dark:bg-orange-950/30" : ""
                        }`}
                        ref={(el) => {
                            accordionRefs.current[classData.className] = el;
                        }}
                    >
                        <button
                            onClick={() => handleToggle(classData.className)}
                            className="w-full text-left"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="text-primary h-5 w-5" />
                                        <CardTitle className="text-xl">
                                            {classData.classLongName}
                                        </CardTitle>
                                        <span className="text-muted-foreground text-base font-normal">
                                            ({classData.trophyCount}{" "}
                                            {classData.trophyCount > 1
                                                ? "trophies"
                                                : "trophy"}{" "}
                                            / {classData.totalDrivers} driver
                                            {classData.totalDrivers !== 1
                                                ? "s"
                                                : ""}
                                            )
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={`h-5 w-5 transition-transform ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </div>
                            </CardHeader>
                        </button>
                        {isOpen && (
                            <CardContent className="pt-0">
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {classData.entries.map((entry) => (
                                        <TrophyEntryCard
                                            key={`${entry.name}-${entry.number}-${entry.class}`}
                                            entry={entry}
                                            isProOrNovice={isProOrNovice}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
