"use client";

import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useLiveData } from "../../hooks/useLiveData";
import type { ResultsEntry } from "@/dto/live-results";

type RunPositionChartProps = {
    selectedDriverId: string;
    classResult: ResultsEntry;
};

export function RunPositionChart({
    selectedDriverId,
    classResult,
}: RunPositionChartProps) {
    const { rawResults, classResultsMap, createDriverId } = useLiveData();

    const { chartData, numberOfDrivers } = useMemo(() => {
        if (!rawResults?.results || !classResult)
            return { chartData: [], numberOfDrivers: 0 };

        // Get the driver's class and determine if it's grouped (P/N)
        const driverClass = classResult.class;
        let classKey = driverClass;
        if (driverClass.startsWith("P")) {
            classKey = "P";
        } else if (driverClass.startsWith("N")) {
            classKey = "N";
        }

        // Get all drivers in the same class
        const classData = classResultsMap?.get(classKey);
        if (!classData) return { chartData: [], numberOfDrivers: 0 };

        // Filter to only drivers in the same class (for P/N, filter by prefix)
        const classFilter = driverClass.startsWith("P")
            ? (c: string) => c.startsWith("P")
            : driverClass.startsWith("N")
              ? (c: string) => c.startsWith("N")
              : (c: string) => c === driverClass;

        const classDrivers = rawResults.results.filter((driver) =>
            classFilter(driver.class)
        );

        if (classDrivers.length === 0)
            return { chartData: [], numberOfDrivers: 0 };

        const numberOfDrivers = classDrivers.length;

        // Find the maximum run number across all drivers
        let maxRun = 0;
        classDrivers.forEach((driver) => {
            driver.segments.forEach((segment) => {
                const runNumbers = Object.keys(segment.runs).map(Number);
                if (runNumbers.length > 0) {
                    maxRun = Math.max(maxRun, ...runNumbers);
                }
            });
        });

        if (maxRun === 0) return { chartData: [], numberOfDrivers };

        // For each run number, calculate position based on best time up to that run
        const data: Array<{
            run: number;
            [driverId: string]: number | string;
        }> = [];

        for (let runNum = 1; runNum <= maxRun; runNum++) {
            // Calculate best time up to this run for each driver
            const driverTimes: Array<{
                driverId: string;
                bestTime: number | null;
            }> = [];

            classDrivers.forEach((driver) => {
                const driverId = createDriverId({
                    name: driver.driverName,
                    number: driver.carNumber,
                    carClass: driver.class,
                });

                // Find best rawTotalTime up to this run
                let bestTime: number | null = null;
                driver.segments.forEach((segment) => {
                    for (let r = 1; r <= runNum; r++) {
                        const run = segment.runs[r];
                        if (run && run.rawTotalTime != null) {
                            if (
                                bestTime === null ||
                                run.rawTotalTime < bestTime
                            ) {
                                bestTime = run.rawTotalTime;
                            }
                        }
                    }
                });

                if (bestTime !== null) {
                    driverTimes.push({ driverId, bestTime });
                }
            });

            // Sort by best time (fastest first)
            driverTimes.sort((a, b) => {
                if (a.bestTime === null) return 1;
                if (b.bestTime === null) return -1;
                return a.bestTime - b.bestTime;
            });

            // Create data point for this run
            const dataPoint: {
                run: number;
                [driverId: string]: number | string;
            } = { run: runNum };

            // Assign positions (handle ties - drivers with same time get same position)
            let currentPosition = 1;
            let previousTime: number | null = null;
            driverTimes.forEach(({ driverId, bestTime }, index) => {
                if (bestTime !== null) {
                    // If this time is different from previous, update position
                    if (previousTime !== null && bestTime !== previousTime) {
                        currentPosition = index + 1;
                    }
                    dataPoint[driverId] = currentPosition;
                    previousTime = bestTime;
                }
            });

            data.push(dataPoint);
        }

        return { chartData: data, numberOfDrivers };
    }, [rawResults, classResult, classResultsMap, createDriverId]);

    // Get all driver IDs for lines (excluding 'run' key)
    const driverIds = useMemo(() => {
        if (chartData.length === 0) return [];
        const ids = new Set<string>();
        chartData.forEach(
            (point: { run: number; [driverId: string]: number | string }) => {
                Object.keys(point).forEach((key) => {
                    if (key !== "run") {
                        ids.add(key);
                    }
                });
            }
        );
        return Array.from(ids);
    }, [chartData]);

    if (chartData.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">
                No run data available
            </p>
        );
    }

    // Custom tooltip
    type TooltipProps = {
        active?: boolean;
        payload?: Array<{
            dataKey: string;
            value: number;
            color: string;
        }>;
        label?: number;
    };

    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background rounded-lg border p-2 shadow-md">
                    <p className="font-semibold">Run {label}</p>
                    {payload.map((entry, index: number) => {
                        const isSelected = entry.dataKey === selectedDriverId;
                        return (
                            <p
                                key={index}
                                style={{ color: entry.color }}
                                className={isSelected ? "font-bold" : ""}
                            >
                                {isSelected ? "You" : "Driver"}: Position{" "}
                                {entry.value}
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold sm:text-lg">
                Position by Run
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 5, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="run"
                        label={{
                            value: "Run Number",
                            position: "insideBottom",
                            offset: -5,
                        }}
                    />
                    <YAxis
                        reversed
                        domain={[1, numberOfDrivers]}
                        padding={{ top: 0, bottom: 0 }}
                        allowDecimals={false}
                        width={0}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {driverIds.map((driverId) => {
                        const isSelected = driverId === selectedDriverId;
                        return (
                            <Line
                                key={driverId}
                                type="monotone"
                                dataKey={driverId}
                                stroke={isSelected ? "#f97316" : "#6b7280"}
                                strokeWidth={isSelected ? 2.5 : 1.5}
                                dot={false}
                                connectNulls={false}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
