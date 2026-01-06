import { describe, it, expect } from "vitest";
import { filterNavForRoles, type NavGroup } from "./navigation";

describe("filterNavForRoles", () => {
    const createMockNavGroups = (): NavGroup[] => [
        {
            name: "Admin",
            items: [
                { text: "Users", href: "/admin/users", roles: ["admin"] },
                {
                    text: "Organizations",
                    href: "/admin/orgs",
                    roles: ["admin", "org_admin"],
                },
            ],
        },
        {
            name: "Settings",
            items: [
                {
                    text: "Profile",
                    href: "/settings",
                    roles: ["user", "admin"],
                },
                { text: "API Keys", href: "/api-keys", roles: ["admin"] },
            ],
        },
    ];

    it("filters items to only include those with matching roles", () => {
        const navGroups = createMockNavGroups();
        const result = filterNavForRoles(navGroups, ["admin"]);

        expect(result[0].items).toHaveLength(2);
        expect(result[0].items[0].text).toBe("Users");
        expect(result[0].items[1].text).toBe("Organizations");

        expect(result[1].items).toHaveLength(2);
        expect(result[1].items[0].text).toBe("Profile");
        expect(result[1].items[1].text).toBe("API Keys");
    });

    it("filters out items without matching roles", () => {
        const navGroups = createMockNavGroups();
        const result = filterNavForRoles(navGroups, ["user"]);

        expect(result[0].items).toHaveLength(0);
        expect(result[1].items).toHaveLength(1);
        expect(result[1].items[0].text).toBe("Profile");
    });

    it("handles multiple roles", () => {
        const navGroups = createMockNavGroups();
        const result = filterNavForRoles(navGroups, ["org_admin"]);

        expect(result[0].items).toHaveLength(1);
        expect(result[0].items[0].text).toBe("Organizations");
        // Profile has roles ["user", "admin"], not "org_admin", so it should be filtered out
        expect(result[1].items).toHaveLength(0);
    });

    it("handles empty roles array", () => {
        const navGroups = createMockNavGroups();
        const result = filterNavForRoles(navGroups, []);

        expect(result[0].items).toHaveLength(0);
        expect(result[1].items).toHaveLength(0);
    });

    it("handles items with multiple roles where one matches", () => {
        const navGroups = createMockNavGroups();
        const result = filterNavForRoles(navGroups, ["org_admin"]);

        // Organizations has both admin and org_admin, should be included
        expect(
            result[0].items.some((item) => item.text === "Organizations")
        ).toBe(true);
    });

    it("preserves group structure", () => {
        const navGroups = createMockNavGroups();
        const result = filterNavForRoles(navGroups, ["admin"]);

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Admin");
        expect(result[1].name).toBe("Settings");
    });
});
