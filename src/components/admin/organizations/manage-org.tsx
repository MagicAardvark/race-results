"use client";

import { upsertOrganization } from "@/app/actions/organization.actions";
import { Button } from "@/components/button/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Organization } from "@/dto/organizations";
import { ReactNode, useActionState } from "react";

const initialState = {
    isError: false,
    message: "",
};

export const ManageOrgDialog = ({
    org,
    trigger,
}: {
    org?: Organization;
    trigger: ReactNode;
}) => {
    const [state, formAction, pending] = useActionState(
        upsertOrganization,
        initialState
    );

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogTitle>{org ? "Edit" : "Add"} Organization</DialogTitle>

                <form action={formAction} className="flex flex-col gap-2">
                    {state.isError && (
                        <div className="text-red-500">{state.message}</div>
                    )}

                    {org && (
                        <input type="hidden" name="org-id" value={org.orgId} />
                    )}

                    <input
                        type="text"
                        name="org-name"
                        defaultValue={org?.name}
                        required
                    />

                    <Button type="submit" disabled={pending}>
                        {pending ? "Saving…" : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
