"use client";

import { addUserOrganizationRole } from "@/app/actions/user.actions";
import { Stack } from "@/app/components/shared/stack";
import { AvailableRole } from "@/dto/roles";
import { OrgWithRoles } from "@/dto/users";
import { Button } from "@/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
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

type AddOrgRoleButtonProps = {
    userId: string;
    userOrg: OrgWithRoles;
    orgId: string;
    orgName: string;
    roles: AvailableRole[];
};

export const AddOrgRoleButton = ({
    userId,
    userOrg,
    orgId,
    orgName,
    roles,
}: AddOrgRoleButtonProps) => {
    const [state, formAction, pending] = useActionState(
        addUserOrganizationRole,
        {
            isError: false,
            message: "",
        }
    );

    const [selectedRole, setSelectedRole] = useState<string>("");

    const handleClose = () => {
        setSelectedRole("");
    };

    const availableRoles = roles.filter(
        (role) => !userOrg.roles.some((r) => r.key === role.key)
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
                <Button>Add Role</Button>
            </DialogTrigger>
            <DialogContent size="large">
                <form action={formAction}>
                    <Stack>
                        <DialogHeader>
                            <DialogTitle>Add Organization Role</DialogTitle>
                            <DialogDescription>
                                Select the role to give this user within{" "}
                                {orgName}.
                            </DialogDescription>
                        </DialogHeader>

                        {state.isError && (
                            <div className="text-red-500">{state.message}</div>
                        )}

                        <input type="hidden" name="userId" value={userId} />
                        <input type="hidden" name="orgId" value={orgId} />

                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="roleId">Role</FieldLabel>
                                <Select
                                    onValueChange={setSelectedRole}
                                    value={selectedRole}
                                    name="roleId"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map((role) => (
                                            <SelectItem
                                                key={role.key}
                                                value={role.roleId}
                                            >
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>

                        <DialogFooter>
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
                                <Button
                                    type="submit"
                                    disabled={pending || !selectedRole}
                                >
                                    {pending ? "Saving…" : "Add Role"}
                                </Button>
                            </Field>
                        </DialogFooter>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>
    );
};
