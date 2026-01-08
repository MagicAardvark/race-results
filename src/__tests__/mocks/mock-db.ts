import { vi } from "vitest";

// Mock Neon database client to prevent connection attempts
vi.mock("@neondatabase/serverless", () => ({
    neon: vi.fn(() => {
        // Return a mock SQL client function
        return vi.fn();
    }),
}));

// Set dummy DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
}

// Mock database connection
export const mockDb = {
    execute: vi.fn(),
    select: vi.fn(() => ({
        from: vi.fn(() => ({
            where: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve([])),
            })),
        })),
    })),
    insert: vi.fn(() => ({
        values: vi.fn(() => Promise.resolve({})),
    })),
    update: vi.fn(() => ({
        set: vi.fn(() => ({
            where: vi.fn(() => Promise.resolve({})),
        })),
    })),
    delete: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve({})),
    })),
};

vi.mock("@/db", () => ({
    db: mockDb,
}));

// Mock Drizzle ORM functions
vi.mock("drizzle-orm", () => ({
    eq: vi.fn((a, b) => ({ a, b })),
    and: vi.fn((...args) => args),
    or: vi.fn((...args) => args),
    sql: vi.fn((strings, ...values) => ({ strings, values })),
    desc: vi.fn((field) => ({ field, direction: "desc" })),
    asc: vi.fn((field) => ({ field, direction: "asc" })),
}));
