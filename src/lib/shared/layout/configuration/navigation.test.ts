import { describe, it, expect } from "vitest";
import { getNavigationConfiguration } from "./navigation";
import { ROLES } from "@/constants/global";

describe("filterNavForRoles", () => {
    it("filters items to only include those with matching roles", () => {
        const result = getNavigationConfiguration([ROLES.orgOwner]);

        result.forEach((group) => {
            group.items.forEach((item) => {
                if (item.show) {
                    expect(item.roles).toContain(ROLES.orgOwner);
                }

                if (!item.show) {
                    expect(item.roles).not.toContain(ROLES.orgOwner);
                }
            });

            if (group.show) {
                expect(group.items.some((item) => item.show)).toBe(true);
            }

            if (!group.show) {
                expect(group.items.every((item) => !item.show)).toBe(true);
            }
        });
    });

    it("handles empty roles array", () => {
        const result = getNavigationConfiguration([]);

        result.forEach((group) => {
            group.items.forEach((item) => {
                expect(item.show).toBe(false);
            });

            expect(group.show).toBe(false);
        });
    });
});
