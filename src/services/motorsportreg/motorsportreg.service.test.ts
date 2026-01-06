import { describe, it, expect } from "vitest";
import { createMotorsportRegService } from "./motorsportreg.service";

describe("MotorsportRegService", () => {
    it("creates service instance with config", () => {
        const service = createMotorsportRegService({
            username: "test",
            password: "test",
            organizationId: "org-1",
        });

        expect(service).toBeDefined();
    });

    it("creates service instance without config", () => {
        const service = createMotorsportRegService();

        expect(service).toBeDefined();
    });
});
