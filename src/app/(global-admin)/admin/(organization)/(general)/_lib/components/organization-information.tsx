"use client";

import { HeaderImageUpload } from "./header-image-upload";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { OrganizationExtended } from "@/dto/organizations";
import { nameof } from "@/lib/utils";
import { useActionState } from "react";
import { updateOrganization } from "@/app/(global-admin)/admin/(organization)/(general)/_lib/actions/update-org";

interface OrganizationInformationProps {
    org: OrganizationExtended;
}

export const OrganizationInformation = ({
    org,
}: OrganizationInformationProps) => {
    const [state, formAction, pending] = useActionState(updateOrganization, {
        isError: false,
        message: "",
    });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">
                Organization Information
            </h1>
            <p className="text-muted-foreground text-sm">
                Update your organization&apos;s name, description, and public
                visibility. The URL slug is derived from the name and cannot be
                changed here. Set MotorsportReg Org ID to pull events from
                MotorsportReg into the calendar.
            </p>
            <Card className="w-full">
                <CardContent className="pt-6">
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
                            <HeaderImageUpload
                                headerImageUrl={org.headerImageUrl}
                                orgName={org.name}
                            />
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
                                        id={nameof<OrganizationExtended>(
                                            "name"
                                        )}
                                        name={nameof<OrganizationExtended>(
                                            "name"
                                        )}
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
                                        id={nameof<OrganizationExtended>(
                                            "slug"
                                        )}
                                        name={nameof<OrganizationExtended>(
                                            "slug"
                                        )}
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
                                        defaultValue={
                                            org.motorsportregOrgId || ""
                                        }
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
                            <div className="flex justify-end gap-2 pt-6">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={pending}>
                                    {pending ? "Saving…" : "Save"}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
