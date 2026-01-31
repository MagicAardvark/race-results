import { Organization } from "@/dto/organizations";

export type InvalidTenant = {
    isValid: false;
};

export type ValidTenant = {
    isValid: true;
    org: Organization;
};

export type Tenant = InvalidTenant | ValidTenant;
