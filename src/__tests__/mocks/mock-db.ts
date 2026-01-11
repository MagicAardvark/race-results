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
const mockSql = vi.fn((strings, ...values) => ({ strings, values }));
// Add inlineParams method that Drizzle views need
(mockSql as { inlineParams?: typeof mockSql }).inlineParams = vi.fn(
    (strings, ...values) => ({
        strings,
        values,
    })
);

vi.mock("drizzle-orm", () => ({
    eq: vi.fn((a, b) => ({ a, b })),
    and: vi.fn((...args) => args),
    or: vi.fn((...args) => args),
    sql: mockSql,
    desc: vi.fn((field) => ({ field, direction: "desc" })),
    asc: vi.fn((field) => ({ field, direction: "asc" })),
}));

// Mock Drizzle view builder to prevent view creation errors in tests
vi.mock("drizzle-orm/pg-core", async () => {
    const actual = await vi.importActual<typeof import("drizzle-orm/pg-core")>(
        "drizzle-orm/pg-core"
    );
    return {
        ...actual,
        pgView: vi.fn((name: string, columns: Record<string, unknown>) => {
            const mockView = {
                _: {
                    name,
                    columns,
                    schema: undefined,
                },
            };
            // Mock the .as() method to return the view object
            (mockView as { as?: () => typeof mockView }).as = vi.fn(
                () => mockView
            );
            return mockView;
        }),
    };
});
