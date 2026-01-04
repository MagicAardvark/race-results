"use client";

import { useState } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { WorkRunFilter } from "./work-run-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { isToday } from "../../utils/is-today";
import { ValueDisplay } from "../shared/value-display";
import { EmptyState } from "../shared/empty-state";

export const WorkRunOrder = () => {
    const { runWork: runWorkData } = useLiveData();
    const [selectedClass, setSelectedClass] = useState<string>("");

    if (!runWorkData) {
        return <EmptyState message="Run work data not available" />;
    }

    const { runWork, numberOfHeats, timestamp } = runWorkData;
    const eventDate = new Date(timestamp);

    if (!isToday(eventDate)) {
        return (
            <div className="mx-2 mb-5 mt-5 text-center">
                <p className="text-muted-foreground">
                    Work/Run order will be available on the day of the event.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5 mt-5 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    Please select your class from the filters below.
                </p>
                <p className="text-sm text-muted-foreground">
                    If you are a Novice, you will run with your base class.
                </p>
                <p className="text-sm text-muted-foreground">
                    i.e. NDS runs with DS.
                </p>

                {numberOfHeats == 2 ? (
                    <p className="text-sm text-muted-foreground">
                        This event will run as <strong>two heats.</strong>
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        This event will run as{" "}
                        <strong>{numberOfHeats} heats</strong>. You are off
                        during the heat(s) not listed as running or working. Use
                        this time to prep your car, get lunch, etc. Please{" "}
                        <strong>watch the flag</strong> to know when to check in
                        for work.
                    </p>
                )}

                <p className="text-sm text-muted-foreground">
                    <strong>
                        You must check in for work both morning and afternoon
                    </strong>
                </p>
            </div>
            <WorkRunFilter
                classes={Object.keys(runWork)}
                selectedClass={selectedClass}
                handleSelectClass={setSelectedClass}
            />
            {selectedClass && runWork[selectedClass] && (
                <div className="mt-4 space-y-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center tracking-widest">
                                {selectedClass}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <ValueDisplay
                                    label="Run"
                                    value={runWork[selectedClass].run}
                                    size="lg"
                                />
                                <ValueDisplay
                                    label="Work"
                                    value={runWork[selectedClass].work}
                                    size="lg"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

