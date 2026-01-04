import { orgApiKeys, orgs } from "@/db";

export type OrganizationDTO = typeof orgs.$inferSelect;

export type OrganizationAdminDTO = OrganizationDTO & {
    orgApiKeys: (typeof orgApiKeys.$inferSelect)[];
};

export interface Organization {
    orgId: string;
    name: string;
    slug: string;
    motorsportregOrgId: string | null;
    description: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface OrganizationExtended extends Organization {
    orgApiKeys: OrgApiKey[];
}

export interface OrgApiKey {
    apiKeyId: string;
    apiKey: string;
    apiKeyEnabled: boolean;
    effectiveAt: Date;
}

export interface CreateOrgDTO {
    name: string;
}

export interface UpdateOrgDTO {
    orgId: string;
    name: string;
    motorsportregOrgId?: string | null;
    description: string | null;
    isPublic: boolean;
    featureFlags?: Record<string, boolean>;
}
