"use client";

import { updateUserInformation } from "@/app/actions/user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { useActionState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { User } from "@/dto/users";

type UserInfoFormProps = {
    user: User;
};

export const UserInfoForm = ({ user }: UserInfoFormProps) => {
    const [userInfoState, userInfoFormAction] = useActionState(
        updateUserInformation,
        {
            isError: false,
            message: "",
        }
    );

    return (
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
                    </FieldGroup>

                    <div className="mt-6 flex">
                        <Button type="submit">Update User Details</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
