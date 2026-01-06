import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

describe("POST /api/ingest/[orgSlug]/results", () => {
    it("returns success with data", async () => {
        const mockData = { test: "data" };
        const request = new NextRequest(
            "http://localhost/api/ingest/test-org/results",
            {
                method: "POST",
                body: JSON.stringify(mockData),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const params = Promise.resolve({ orgSlug: "test-org" });
        const response = await POST(request, { params });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data).toEqual(mockData);
    });

    it("handles empty body", async () => {
        const request = new NextRequest(
            "http://localhost/api/ingest/test-org/results",
            {
                method: "POST",
                body: JSON.stringify({}),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const params = Promise.resolve({ orgSlug: "test-org" });
        const response = await POST(request, { params });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data).toEqual({});
    });
});
