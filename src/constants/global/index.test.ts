import { describe, it, expect } from "vitest";
import { ROLES } from "./index";

describe("ROLES", () => {
    it("exports array of roles", () => {
        expect(Object.keys(ROLES)).toEqual(["admin", "orgOwner", "user"]);
    });
});
