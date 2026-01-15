"use client";

import { updateUser } from "@/app/actions/user.actions";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { User } from "@/dto/users";
import { useActionState } from "react";

type UpdateUserFormProps = {
    user: User;
    availableRoles: Array<{ key: string; name: string }>;
};

export function UpdateUserForm({ user, availableRoles }: UpdateUserFormProps) {
    const [state, formAction] = useActionState(updateUser, {
        isError: false,
        message: "",
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    {state.isError && (
                        <div className="mb-4 text-red-500">{state.message}</div>
                    )}

                    <input type="hidden" name="userId" value={user.userId} />

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

                        <Field>
                            <FieldLabel>Roles</FieldLabel>
                            <div className="space-y-2">
                                {availableRoles.map((role) => (
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

                    <div className="mt-6 flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
