import { Organization } from "@/dto/organizations";

type InvalidTenant = {
    isValid: false;
};

type GlobalTenant = {
    isValid: true;
    isGlobal: true;
};

type ValidTenant = {
    isValid: true;
    isGlobal: false;
    org: Organization;
};

export type Tenant = InvalidTenant | GlobalTenant | ValidTenant;
