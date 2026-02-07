"use client";

import { updateOrganization } from "@/app/actions/organization.actions";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";

import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";

import { OrganizationExtended } from "@/dto/organizations";
import { OrgFeatureFlags } from "@/dto/feature-flags";
import { nameof } from "@/lib/utils";
import { useActionState } from "react";

export const UpdateOrgForm = ({
    org,
    featureFlags: _featureFlags,
}: {
    org: OrganizationExtended;
    featureFlags: OrgFeatureFlags;
}) => {
    const [state, formAction, pending] = useActionState(updateOrganization, {
        isError: false,
        message: "",
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    {state.isError && (
                        <div className="text-red-500">{state.message}</div>
                    )}

                    <input
                        type="hidden"
                        name={nameof<OrganizationExtended>("orgId")}
                        value={org.orgId}
                    />

                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel
                                    htmlFor={nameof<OrganizationExtended>(
                                        "name"
                                    )}
                                >
                                    Name
                                </FieldLabel>
                                <Input
                                    type="text"
                                    id={nameof<OrganizationExtended>("name")}
                                    name={nameof<OrganizationExtended>("name")}
                                    defaultValue={org.name}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel
                                    htmlFor={nameof<OrganizationExtended>(
                                        "slug"
                                    )}
                                >
                                    URL Slug
                                </FieldLabel>
                                <Input
                                    className="pointer-events-none bg-gray-100"
                                    type="text"
                                    id={nameof<OrganizationExtended>("slug")}
                                    name={nameof<OrganizationExtended>("slug")}
                                    defaultValue={org.slug}
                                    readOnly
                                />
                            </Field>
                            <Field>
                                <FieldLabel
                                    htmlFor={nameof<OrganizationExtended>(
                                        "motorsportregOrgId"
                                    )}
                                >
                                    MotorsportReg Org ID
                                </FieldLabel>
                                <Input
                                    type="text"
                                    id={nameof<OrganizationExtended>(
                                        "motorsportregOrgId"
                                    )}
                                    name={nameof<OrganizationExtended>(
                                        "motorsportregOrgId"
                                    )}
                                    defaultValue={org.motorsportregOrgId || ""}
                                    placeholder="Enter MotorsportReg organization ID"
                                />
                            </Field>
                            <Field className="col-span-2">
                                <FieldLabel
                                    htmlFor={nameof<OrganizationExtended>(
                                        "description"
                                    )}
                                >
                                    Description
                                </FieldLabel>
                                <Textarea
                                    defaultValue={org.description || ""}
                                    id={nameof<OrganizationExtended>(
                                        "description"
                                    )}
                                    name={nameof<OrganizationExtended>(
                                        "description"
                                    )}
                                ></Textarea>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox
                                    defaultChecked={org.isPublic}
                                    id={nameof<OrganizationExtended>(
                                        "isPublic"
                                    )}
                                    name={nameof<OrganizationExtended>(
                                        "isPublic"
                                    )}
                                />
                                <FieldLabel
                                    htmlFor={nameof<OrganizationExtended>(
                                        "isPublic"
                                    )}
                                >
                                    Publicly Viewable
                                </FieldLabel>
                            </Field>
                        </div>
                        <Field orientation="horizontal">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={pending}>
                                {pending ? "Saving…" : "Save"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};
