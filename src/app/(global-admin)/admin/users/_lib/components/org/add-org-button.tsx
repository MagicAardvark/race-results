"use client";

import { addUserToOrganization } from "@/app/actions/user.actions";
import { Organization } from "@/dto/organizations";
import { UserWithExtendedDetails } from "@/dto/users";
import { Button } from "@/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import { useActionState, useState } from "react";

type AddOrgButtonProps = {
    user: UserWithExtendedDetails;
    orgs: Organization[];
};

export const AddOrgButton = ({ user, orgs }: AddOrgButtonProps) => {
    const [state, formAction, pending] = useActionState(addUserToOrganization, {
        isError: false,
        message: "",
    });

    const [selectedOrg, setSelectedOrg] = useState<string>("");

    const handleClose = () => {
        setSelectedOrg("");
    };

    const availableOrgs = orgs.filter(
        (org) => !user.orgs.some((userOrg) => userOrg.org.orgId === org.orgId)
    );

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button>Add Organization</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add User to Organization</DialogTitle>
                <p>
                    Select an organization to add the user to. This will give
                    them the initial role of Organization Manager.
                </p>
                <form action={formAction}>
                    {state.isError && (
                        <div className="text-red-500">{state.message}</div>
                    )}

                    <input type="hidden" name="userId" value={user.userId} />

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="orgId">
                                Organization
                            </FieldLabel>
                            <Select
                                name="orgId"
                                value={selectedOrg}
                                onValueChange={setSelectedOrg}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableOrgs.map((org) => (
                                        <SelectItem
                                            key={org.orgId}
                                            value={org.orgId}
                                        >
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field orientation="horizontal">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={pending}>
                                {pending
                                    ? "Saving…"
                                    : "Add User to Organization"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};
