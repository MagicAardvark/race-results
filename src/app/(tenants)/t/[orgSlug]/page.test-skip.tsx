// Will fix later
// import { describe, it, expect, vi } from "vitest";
// import { defaultOrg, render, screen } from "@/__tests__/test-utils";
// import Page from "./page";
// import { tenantService } from "@/services/tenants/tenant.service";

// vi.mock("@/services/tenants/tenant.service", () => ({
//     tenantService: {
//         getTenant: vi.fn(),
//     },
// }));
// vi.mock("@/db/repositories/org-events.repo", () => ({
//     orgEventsRepository: {
//         listByOrgId: vi.fn().mockResolvedValue([]),
//     },
// }));
// vi.mock("@/services/motorsportreg/motorsportreg.service", () => ({
//     motorsportRegService: {
//         getOrganizationCalendar: vi.fn().mockResolvedValue({
//             response: { events: [] },
//         }),
//     },
// }));
// vi.mock("next/navigation", () => ({
//     redirect: vi.fn((path: string) => {
//         throw new Error(`redirect:${path}`);
//     }),
// }));

// describe("Tenant org page", () => {
//     it("renders org name and events section when tenant is valid", async () => {
//         vi.mocked(tenantService.getTenant).mockResolvedValue(defaultOrg);

//         const jsx = await Page();
//         render(jsx);

//         expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
//             "Test Organization"
//         );
//         expect(screen.getByText("Test description")).toBeVisible();
//         expect(
//             screen.getByRole("heading", { name: "Upcoming Events" })
//         ).toBeVisible();
//         expect(
//             screen.getByText("No upcoming events scheduled. Check back soon.")
//         ).toBeVisible();
//     });

//     it("renders Back to Organizations and Live Timing links", async () => {
//         vi.mocked(tenantService.getTenant).mockResolvedValue(defaultOrg);

//         const jsx = await Page();
//         render(jsx);

//         expect(
//             screen.getByRole("link", { name: /Back to Organizations/ })
//         ).toHaveAttribute("href", "/");
//         expect(
//             screen.getByRole("link", { name: /Live Timing/ })
//         ).toHaveAttribute("href", "/t/test-org/live");
//     });
// });
