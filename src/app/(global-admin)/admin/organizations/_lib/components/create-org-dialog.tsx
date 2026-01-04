"use client";

import { createOrganization } from "@/app/actions/organization.actions";
import { Button } from "@/ui/button-wrapper";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { OrganizationExtended } from "@/dto/organizations";
import { nameof } from "@/lib/utils";
import { ReactElement, useActionState } from "react";

export const CreateOrgDialog = ({ trigger }: { trigger: ReactElement }) => {
    const [state, formAction, pending] = useActionState(createOrganization, {
        isError: false,
        message: "",
    });

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogTitle>Create Organization</DialogTitle>

                <form action={formAction} className="flex flex-col gap-2">
                    {state.isError && (
                        <div className="text-red-500">{state.message}</div>
                    )}

                    <FieldGroup>
                        <Field>
                            <FieldLabel
                                htmlFor={nameof<OrganizationExtended>("name")}
                            >
                                Name
                            </FieldLabel>
                            <Input
                                type="text"
                                id={nameof<OrganizationExtended>("name")}
                                name={nameof<OrganizationExtended>("name")}
                                placeholder="Pizza Club"
                                defaultValue={""}
                                required
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"ghost"}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
