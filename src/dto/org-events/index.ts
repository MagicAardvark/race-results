export interface OrgEventDTO {
    eventId: string;
    orgId: string;
    name: string;
    startAt: Date;
    endAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateOrgEventDTO {
    orgId: string;
    name: string;
    startAt: Date;
    endAt: Date;
}

export interface UpdateOrgEventDTO {
    name: string;
    startAt: Date;
    endAt: Date;
}
