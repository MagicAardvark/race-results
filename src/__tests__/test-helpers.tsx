import React from "react";

/**
 * Test helpers for common testing patterns
 * Note: vi.mock() must be called at the top level of test files,
 * so these helpers are for shared mock implementations and utilities
 */

/**
 * Creates a mock component that renders with a test ID
 * Useful for consistent component mocking across tests
 */
export function createMockComponent(
    componentName: string,
    testId: string
): React.ComponentType {
    const MockComponent = () => <div data-testid={testId}>{componentName}</div>;
    MockComponent.displayName = componentName;
    return MockComponent;
}
