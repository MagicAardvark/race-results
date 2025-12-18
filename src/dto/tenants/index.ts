import { Organization } from "@/dto/organizations";

export type InvalidTenant = {
    isValid: false;
};

export type GlobalTenant = {
    isValid: true;
    isGlobal: true;
};

export type ValidTenant = {
    isValid: true;
    isGlobal: false;
    org: Organization;
};

export type Tenant = InvalidTenant | GlobalTenant | ValidTenant;
