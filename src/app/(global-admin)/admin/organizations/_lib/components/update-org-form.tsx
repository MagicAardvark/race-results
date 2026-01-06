"use client";

import { updateOrganization } from "@/app/actions/organization.actions";
import { Button } from "@/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";

import { Field, FieldGroup, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";

import { OrganizationExtended } from "@/dto/organizations";
import { OrgFeatureFlags } from "@/dto/feature-flags";
import { nameof } from "@/lib/utils";
import { useActionState, useMemo } from "react";

type FeatureFlagGroup = {
    namespace: string;
    namespaceLabel: string;
    flags: Array<{
        key: string;
        label: string;
        enabled: boolean;
    }>;
};

// Convert camelCase to Title Case
const formatLabel = (text: string): string => {
    return text
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

export const UpdateOrgForm = ({
    org,
    featureFlags,
}: {
    org: OrganizationExtended;
    featureFlags: OrgFeatureFlags;
}) => {
    const [state, formAction, pending] = useActionState(updateOrganization, {
        isError: false,
        message: "",
    });

    // Group feature flags by namespace
    const groupedFlags = useMemo(() => {
        const groups = new Map<string, FeatureFlagGroup["flags"]>();

        for (const [key, enabled] of Object.entries(featureFlags)) {
            const parts = key.split(".");
            if (parts.length >= 3) {
                const namespace = parts.slice(0, -1).join(".");
                const flagName = parts[parts.length - 1];

                if (!groups.has(namespace)) {
                    groups.set(namespace, []);
                }
                groups.get(namespace)!.push({
                    key,
                    label: formatLabel(flagName),
                    enabled,
                });
            }
        }

        return Array.from(groups.entries()).map(([namespace, flags]) => {
            const namespaceParts = namespace.split(".");
            // Show only middle part(s) - skip first part (e.g., "feature")
            const middleParts = namespaceParts.slice(1);
            const namespaceLabel = middleParts.map(formatLabel).join(" → ");

            return {
                namespace,
                namespaceLabel,
                flags,
            };
        });
    }, [featureFlags]);

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
                        <div className="mt-6 border-t pt-6">
                            <h3 className="mb-4 text-lg font-semibold">
                                Feature Flags
                            </h3>
                            {groupedFlags.length > 0 ? (
                                <div className="space-y-4">
                                    {groupedFlags.map((group) => (
                                        <div
                                            key={group.namespace}
                                            className="rounded-lg border p-4"
                                        >
                                            <h4 className="mb-3 text-lg font-semibold">
                                                {group.namespaceLabel}
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {group.flags.map((flag) => (
                                                    <Field
                                                        key={flag.key}
                                                        orientation="horizontal"
                                                    >
                                                        <Checkbox
                                                            defaultChecked={flag.enabled}
                                                            id={flag.key}
                                                            name={flag.key}
                                                        />
                                                        <FieldLabel htmlFor={flag.key}>
                                                            {flag.label}
                                                        </FieldLabel>
                                                    </Field>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No feature flags configured
                                </p>
                            )}
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
