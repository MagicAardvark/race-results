import { orgs } from "@/db";
import { Infer } from "next/dist/compiled/superstruct";

export type OrganizationDTO = Infer<typeof orgs>;

export interface Organization {
    orgId: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface CreateOrgDTO {
    name: string;
}

export interface UpdateOrgDTO {
    orgId: string;
    name: string;
}
