import { describe, it, expect } from "vitest";
import { ROLES } from "./index";

describe("ROLES", () => {
    it("exports admin role", () => {
        expect(ROLES.admin).toBe("admin");
    });

    it("exports orgOwner role", () => {
        expect(ROLES.orgOwner).toBe("org_owner");
    });

    it("exports user role", () => {
        expect(ROLES.user).toBe("user");
    });

    it("has all expected role keys", () => {
        expect(Object.keys(ROLES)).toEqual(["admin", "orgOwner", "user"]);
    });
});
