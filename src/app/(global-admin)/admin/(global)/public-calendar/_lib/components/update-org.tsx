"use client";

import { rebuildOrgCalendar } from "@/app/(global-admin)/admin/(global)/public-calendar/_lib/actions/rebuild-org-calendar";
import { Loading } from "@/app/components/shared/loading";
import { Stack } from "@/app/components/shared/stack";
import { Organization } from "@/dto/organizations";
import { Button } from "@/ui/button";
import { useState } from "react";

type UpdateOrgProps = {
    orgs: Organization[];
};

export const UpdateOrg = ({ orgs }: UpdateOrgProps) => {
    const [rebuilding, setRebuilding] = useState(false);

    const updateAllOrgs = async (orgSlug: string) => {
        setRebuilding(true);
        await rebuildOrgCalendar(orgSlug);
        // Add a small delay to make the UI switch less jarring
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRebuilding(false);
    };

    return (
        <Stack>
            <Loading loading={rebuilding} message="Rebuilding cache..." />
            <h3 className="font-bold">Update Organization</h3>
            <p className="text-muted-foreground text-sm">
                Update the public calendar cache for a specific organization.
            </p>
            <Stack>
                {orgs.map((org) => (
                    <div
                        key={org.orgId}
                        className="grid grid-cols-[200px_150px] items-center"
                    >
                        <div>{org.name}</div>
                        <div>
                            <Button
                                onClick={async () =>
                                    await updateAllOrgs(org.slug)
                                }
                            >
                                Regenerate
                            </Button>
                        </div>
                    </div>
                ))}
            </Stack>
        </Stack>
    );
};
