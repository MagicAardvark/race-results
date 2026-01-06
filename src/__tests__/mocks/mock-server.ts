import { setupServer } from "msw/node";
import { handlers } from "./mock-handlers";

// Setup MSW server for Node.js (Vitest)
// Note: The server lifecycle is managed in setup.tsx to avoid duplicate hooks
export const server = setupServer(...handlers);
