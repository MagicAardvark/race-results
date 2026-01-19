"use client";

import {
    updateUserGlobalRoles,
    updateUserInformation,
} from "@/app/actions/user.actions";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { User } from "@/dto/users";
import { useActionState } from "react";
import { AvailableRole } from "@/dto/roles";

type UpdateUserFormProps = {
    user: User;
    availableGlobalRoles: AvailableRole[];
};

export function UpdateUserForm({
    user,
    availableGlobalRoles,
}: UpdateUserFormProps) {
    const [userInfoState, userInfoFormAction] = useActionState(
        updateUserInformation,
        {
            isError: false,
            message: "",
        }
    );
    const [userRolesState, userRolesFormAction] = useActionState(
        updateUserGlobalRoles,
        {
            isError: false,
            message: "",
        }
    );

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={userInfoFormAction}>
                        {userInfoState.isError && (
                            <div className="mb-4 text-red-500">
                                {userInfoState.message}
                            </div>
                        )}

                        <input
                            type="hidden"
                            name="userId"
                            value={user.userId}
                        />

                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="displayName">
                                    Display Name
                                </FieldLabel>
                                <Input
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    defaultValue={user.displayName || ""}
                                />
                            </Field>
                        </FieldGroup>

                        <div className="mt-6 flex">
                            <Button type="submit">Update User Details</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Global Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={userRolesFormAction}>
                        {userRolesState.isError && (
                            <div className="mb-4 text-red-500">
                                {userRolesState.message}
                            </div>
                        )}

                        <input
                            type="hidden"
                            name="userId"
                            value={user.userId}
                        />

                        <FieldGroup>
                            <Field>
                                <div className="space-y-2">
                                    {availableGlobalRoles.map((role) => (
                                        <div
                                            key={role.key}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`role.${role.key}`}
                                                name={`role.${role.key}`}
                                                defaultChecked={user.roles.includes(
                                                    role.key
                                                )}
                                            />
                                            <label
                                                htmlFor={`role.${role.key}`}
                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {role.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Field>
                        </FieldGroup>

                        <div className="mt-6 flex">
                            <Button type="submit">Update Global Roles</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Organizations</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
            </Card>
        </>
    );
}
