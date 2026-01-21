"use client";

import { updateUserGlobalRoles } from "@/app/actions/user.actions";
import { AvailableRole } from "@/dto/roles";
import { User } from "@/dto/users";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { useActionState } from "react";

type GlobalRolesProps = {
    user: User;
    availableRoles: AvailableRole[];
};

export const GlobalRoles = ({
    user,
    availableRoles: roles,
}: GlobalRolesProps) => {
    const [userRolesState, userRolesFormAction] = useActionState(
        updateUserGlobalRoles,
        {
            isError: false,
            message: "",
        }
    );

    return (
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

                    <input type="hidden" name="userId" value={user.userId} />

                    <FieldGroup>
                        <Field>
                            <div className="space-y-2">
                                {roles.map((role) => (
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
                                        <FieldLabel
                                            htmlFor={`role.${role.key}`}
                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {role.name}
                                        </FieldLabel>
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
    );
};
