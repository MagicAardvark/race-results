"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import { switchTenant } from "@/app/(global-admin)/admin/_lib/actions/switch-teant";
import { OrgWithRoles } from "@/dto/users";

type InvalidOrgProps = {
    orgs: OrgWithRoles[];
};

export const InvalidOrg = ({ orgs }: InvalidOrgProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
            <h2 className="text-xl font-semibold">
                Selected organization is invalid.
            </h2>
            <p className="text-muted-foreground text-center">
                <Select
                    onValueChange={async (value) => await switchTenant(value)}
                >
                    <SelectTrigger>
                        <SelectValue
                            placeholder={"Select a valid organization"}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {orgs.map((org) => (
                            <SelectItem key={org.org.slug} value={org.org.slug}>
                                {org.org.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </p>
        </div>
    );
};
