"use client";

import { useMemo, useState } from "react";
import { Button } from "@/ui/button";
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useLiveData } from "../../hooks/useLiveData";
import { FEATURE_FLAGS } from "../../config/feature-flags";

type TimesDistributionChartProps = {
    selectedDriverId: string;
};

export function TimesDistributionChart({
    selectedDriverId,
}: TimesDistributionChartProps) {
    const { paxResults, rawResults, featureFlags, createDriverId } =
        useLiveData();
    const isPaxEnabled = featureFlags[FEATURE_FLAGS.PAX_ENABLED] === true;

    // When PAX is disabled, always use "raw". When enabled, allow user selection.
    const [userSelectedTimeType, setUserSelectedTimeType] = useState<
        "raw" | "pax"
    >("pax");
    const timeType = isPaxEnabled ? userSelectedTimeType : "raw";

    // Get all drivers based on selected time type
    const chartData = useMemo(() => {
        let data: Array<{
            time: number;
            name: string;
            number: string;
            carClass: string;
            position: number;
            isSelected: boolean;
            driverId: string;
        }> = [];

        if (timeType === "pax" && paxResults?.results) {
            data = paxResults.results
                .map((driver) => {
                    const driverId = createDriverId({
                        name: driver.driverName,
                        number: driver.carNumber,
                        carClass: driver.class,
                    });
                    return {
                        time: driver.indexedTotalTime ?? 0,
                        name: driver.driverName,
                        number: driver.carNumber,
                        carClass: driver.class,
                        position: driver.indexedPosition.position,
                        isSelected: driverId === selectedDriverId,
                        driverId,
                    };
                })
                .filter((d) => d.time != null && !isNaN(d.time) && d.time > 0);
        } else if (timeType === "raw" && rawResults?.results) {
            data = rawResults.results
                .map((result) => {
                    const driverId = createDriverId({
                        name: result.driverName,
                        number: result.carNumber,
                        carClass: result.class,
                    });
                    return {
                        time: result.rawTotalTime ?? 0,
                        name: result.driverName,
                        number: result.carNumber,
                        carClass: result.class,
                        position: result.rawPosition.position,
                        isSelected: driverId === selectedDriverId,
                        driverId,
                    };
                })
                .filter((d) => d.time != null && !isNaN(d.time) && d.time > 0);
        }

        // Sort by time (fastest first)
        return data.sort((a, b) => a.time - b.time);
    }, [timeType, paxResults, rawResults, selectedDriverId, createDriverId]);

    // Calculate histogram data with 0.5-second buckets
    const histogramData = useMemo(() => {
        if (chartData.length === 0) return [];

        const sortedTimes = chartData.map((d) => d.time);
        const min = Math.floor(sortedTimes[0] || 0);
        const max = Math.ceil(sortedTimes[sortedTimes.length - 1] || 0);

        // Create 0.5-second buckets and count drivers in each
        const bucketCounts: Record<number, number> = {};
        const numBuckets = (max - min) * 2 + 1;
        for (let i = 0; i < numBuckets; i++) {
            bucketCounts[i] = 0;
        }

        chartData.forEach((driver) => {
            // Bucket is floor(time * 2) to get 0.5-second intervals
            const bucket = Math.floor(driver.time * 2) - Math.floor(min * 2);
            if (bucketCounts[bucket] !== undefined) {
                bucketCounts[bucket]++;
            }
        });

        // Create histogram data - one bar per time bucket
        const data: Array<{
            timeBucket: number;
            count: number;
            label: string;
        }> = [];
        for (let i = 0; i < numBuckets; i++) {
            const bucketStart = min + i * 0.5;
            const bucketEnd = bucketStart + 0.5;
            data.push({
                timeBucket: bucketStart,
                count: bucketCounts[i] || 0,
                label: `${bucketStart.toFixed(1)}s - ${bucketEnd.toFixed(1)}s`,
            });
        }

        return data;
    }, [chartData]);

    if (chartData.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">No times available</p>
        );
    }

    // Find max count for X-axis domain
    const maxCount = Math.max(...histogramData.map((d) => d.count), 1);

    // Find selected driver's data
    const selectedDriverData = chartData.find((d) => d.isSelected);
    const selectedTime = selectedDriverData?.time || 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-semibold sm:text-lg">
                    Time Distribution
                </h3>
                {isPaxEnabled && (
                    <div className="flex gap-2">
                        <Button
                            variant={timeType === "pax" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setUserSelectedTimeType("pax")}
                        >
                            PAX
                        </Button>
                        <Button
                            variant={timeType === "raw" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setUserSelectedTimeType("raw")}
                        >
                            Raw
                        </Button>
                    </div>
                )}
            </div>
            <div className="w-full overflow-x-auto">
                <div
                    className="min-w-full"
                    style={{
                        height: `${Math.max(250, Math.min(histogramData.length * 20, 500))}px`,
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={histogramData}
                            layout="vertical"
                            margin={{
                                top: 10,
                                right: 5,
                                bottom: 25,
                                left: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                strokeOpacity={0.2}
                            />
                            <XAxis
                                type="number"
                                dataKey="count"
                                name="Count"
                                label={{
                                    value: "Number of Drivers",
                                    position: "insideBottom",
                                    offset: -5,
                                    style: { fontSize: "10px" },
                                }}
                                domain={[0, maxCount * 1.1]}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(value) =>
                                    Math.round(value).toString()
                                }
                            />
                            <YAxis
                                type="category"
                                dataKey="timeBucket"
                                name="Time"
                                label={{
                                    value: `${timeType === "pax" ? "PAX" : "Raw"} Time (seconds)`,
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fontSize: "10px" },
                                }}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(value) => {
                                    const bucketStart = value as number;
                                    return `${bucketStart.toFixed(1)}s`;
                                }}
                                width={50}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-background rounded-lg border p-2 shadow-md">
                                                <p className="mb-2 font-semibold">
                                                    {data.label}
                                                </p>
                                                <p className="text-sm">
                                                    Drivers:{" "}
                                                    <span className="font-mono">
                                                        {data.count}
                                                    </span>
                                                </p>
                                                {selectedDriverData &&
                                                    Math.floor(
                                                        selectedTime * 2
                                                    ) ===
                                                        Math.floor(
                                                            data.timeBucket * 2
                                                        ) && (
                                                        <p className="mt-2 border-t pt-2 text-sm">
                                                            <span className="font-semibold text-[#ef4444]">
                                                                You:
                                                            </span>{" "}
                                                            <span className="font-mono">
                                                                {selectedTime.toFixed(
                                                                    3
                                                                )}
                                                                s
                                                            </span>
                                                        </p>
                                                    )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            {/* Horizontal bars for each time bucket */}
                            <Bar
                                dataKey="count"
                                fill="#a855f7"
                                fillOpacity={0.6}
                                radius={[0, 4, 4, 0]}
                            >
                                {histogramData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            selectedDriverData &&
                                            Math.floor(selectedTime * 2) ===
                                                Math.floor(entry.timeBucket * 2)
                                                ? "#ef4444"
                                                : "#a855f7"
                                        }
                                        fillOpacity={
                                            selectedDriverData &&
                                            Math.floor(selectedTime * 2) ===
                                                Math.floor(entry.timeBucket * 2)
                                                ? 0.8
                                                : 0.6
                                        }
                                    />
                                ))}
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
