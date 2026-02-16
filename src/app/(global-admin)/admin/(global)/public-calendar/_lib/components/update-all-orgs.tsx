"use client";

import { rebuildCombinedPublicCalendar } from "@/app/(global-admin)/admin/(global)/public-calendar/_lib/actions/rebuild-combined-calendar";
import { Loading } from "@/app/components/shared/loading";
import { Stack } from "@/app/components/shared/stack";
import { Button } from "@/ui/button";
import { useState } from "react";

export const UpdateAllOrgs = () => {
    const [rebuilding, setRebuilding] = useState(false);

    const updateAllOrgs = async () => {
        setRebuilding(true);
        await rebuildCombinedPublicCalendar();
        setRebuilding(false);
    };

    return (
        <Stack>
            <Loading loading={rebuilding} message="Rebuilding cache..." />
            <h3 className="font-bold">Combined Public Calendar</h3>
            <p className="text-muted-foreground text-sm">
                Regenerate the combined public calendar cache.
            </p>
            <div>
                <Button onClick={async () => await updateAllOrgs()}>
                    Regenerate
                </Button>
            </div>
        </Stack>
    );
};
