import { describe, it, expect } from "vitest";
import {
    NotFoundError,
    ValidationError,
    DatabaseError,
    ApiError,
} from "./app-errors";

describe("NotFoundError", () => {
    it("creates error with correct name and message", () => {
        const error = new NotFoundError("Resource not found");
        expect(error.name).toBe("NotFoundError");
        expect(error.message).toBe("Resource not found");
        expect(error).toBeInstanceOf(Error);
    });

    it("extends Error", () => {
        const error = new NotFoundError("Test");
        expect(error).toBeInstanceOf(Error);
    });
});

describe("ValidationError", () => {
    it("creates error with correct name and message", () => {
        const error = new ValidationError("Invalid input");
        expect(error.name).toBe("ValidationError");
        expect(error.message).toBe("Invalid input");
        expect(error).toBeInstanceOf(Error);
    });

    it("extends Error", () => {
        const error = new ValidationError("Test");
        expect(error).toBeInstanceOf(Error);
    });
});

describe("DatabaseError", () => {
    it("creates error with correct name and message", () => {
        const error = new DatabaseError("Database connection failed");
        expect(error.name).toBe("DatabaseError");
        expect(error.message).toBe("Database connection failed");
        expect(error).toBeInstanceOf(Error);
    });

    it("extends Error", () => {
        const error = new DatabaseError("Test");
        expect(error).toBeInstanceOf(Error);
    });
});

describe("ApiError", () => {
    it("creates error with correct name and message", () => {
        const error = new ApiError("API request failed");
        expect(error.name).toBe("ApiError");
        expect(error.message).toBe("API request failed");
        expect(error).toBeInstanceOf(Error);
    });

    it("accepts statusCode", () => {
        const error = new ApiError("Not found", 404);
        expect(error.statusCode).toBe(404);
    });

    it("accepts response", () => {
        const response = { detail: "Resource not found" };
        const error = new ApiError("Error", 404, response);
        expect(error.response).toBe(response);
    });

    it("accepts both statusCode and response", () => {
        const response = { error: "Bad request" };
        const error = new ApiError("Error", 400, response);
        expect(error.statusCode).toBe(400);
        expect(error.response).toBe(response);
    });

    it("extends Error", () => {
        const error = new ApiError("Test");
        expect(error).toBeInstanceOf(Error);
    });
});
