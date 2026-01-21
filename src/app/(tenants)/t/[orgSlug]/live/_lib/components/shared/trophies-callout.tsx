"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";

export function TrophiesCallout() {
    const params = useParams();
    const orgSlug = params.orgSlug as string;
    const basePath = useMemo(() => `/t/${orgSlug}/live`, [orgSlug]);

    // TODO: Once we have a toggle to show the trophies callout, we can remove that.
    const showTrophies = false;

    if (!showTrophies) {
        return null;
    }

    return (
        <Card className="mb-6 border-purple-400 bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50">
            <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                    <div>
                        <p className="text-sm font-semibold">
                            View Trophy Winners & Shoutouts
                        </p>
                        <p className="text-xs">
                            See who won class trophies and special recognition
                            shoutouts
                        </p>
                    </div>
                </div>
                <Button
                    asChild
                    size="sm"
                    className="bg-purple-700 text-white hover:bg-purple-800"
                >
                    <Link href={`${basePath}/trophies`}>View Trophies</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
