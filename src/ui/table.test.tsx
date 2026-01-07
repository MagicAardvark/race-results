import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
} from "./table";

describe("Table", () => {
    it("renders table with container", () => {
        renderWithProviders(
            <Table data-testid="table">
                <tbody>
                    <tr>
                        <td>Cell</td>
                    </tr>
                </tbody>
            </Table>
        );
        const container = screen.getByTestId("table").parentElement;
        expect(container).toHaveAttribute("data-slot", "table-container");
        expect(screen.getByTestId("table")).toHaveAttribute(
            "data-slot",
            "table"
        );
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Table className="custom-class" data-testid="table">
                <tbody>
                    <tr>
                        <td>Cell</td>
                    </tr>
                </tbody>
            </Table>
        );
        const table = screen.getByTestId("table");
        expect(table).toHaveClass("custom-class");
    });
});

describe("TableHeader", () => {
    it("renders thead element", () => {
        renderWithProviders(
            <Table>
                <TableHeader data-testid="header">
                    <tr>
                        <th>Header</th>
                    </tr>
                </TableHeader>
            </Table>
        );
        const header = screen.getByTestId("header");
        expect(header.tagName).toBe("THEAD");
        expect(header).toHaveAttribute("data-slot", "table-header");
    });
});

describe("TableBody", () => {
    it("renders tbody element", () => {
        renderWithProviders(
            <Table>
                <TableBody data-testid="body">
                    <tr>
                        <td>Cell</td>
                    </tr>
                </TableBody>
            </Table>
        );
        const body = screen.getByTestId("body");
        expect(body.tagName).toBe("TBODY");
        expect(body).toHaveAttribute("data-slot", "table-body");
    });
});

describe("TableFooter", () => {
    it("renders tfoot element", () => {
        renderWithProviders(
            <Table>
                <TableFooter data-testid="footer">
                    <tr>
                        <td>Footer</td>
                    </tr>
                </TableFooter>
            </Table>
        );
        const footer = screen.getByTestId("footer");
        expect(footer.tagName).toBe("TFOOT");
        expect(footer).toHaveAttribute("data-slot", "table-footer");
    });
});

describe("TableRow", () => {
    it("renders tr element", () => {
        renderWithProviders(
            <Table>
                <tbody>
                    <TableRow data-testid="row">
                        <td>Cell</td>
                    </TableRow>
                </tbody>
            </Table>
        );
        const row = screen.getByTestId("row");
        expect(row.tagName).toBe("TR");
        expect(row).toHaveAttribute("data-slot", "table-row");
    });
});

describe("TableHead", () => {
    it("renders th element", () => {
        renderWithProviders(
            <Table>
                <thead>
                    <tr>
                        <TableHead data-testid="head">Header</TableHead>
                    </tr>
                </thead>
            </Table>
        );
        const head = screen.getByTestId("head");
        expect(head.tagName).toBe("TH");
        expect(head).toHaveAttribute("data-slot", "table-head");
        expect(head).toHaveTextContent("Header");
    });
});

describe("TableCell", () => {
    it("renders td element", () => {
        renderWithProviders(
            <Table>
                <tbody>
                    <tr>
                        <TableCell data-testid="cell">Cell Content</TableCell>
                    </tr>
                </tbody>
            </Table>
        );
        const cell = screen.getByTestId("cell");
        expect(cell.tagName).toBe("TD");
        expect(cell).toHaveAttribute("data-slot", "table-cell");
        expect(cell).toHaveTextContent("Cell Content");
    });
});

describe("TableCaption", () => {
    it("renders caption element", () => {
        renderWithProviders(
            <Table>
                <TableCaption data-testid="caption">
                    Table Description
                </TableCaption>
                <tbody>
                    <tr>
                        <td>Cell</td>
                    </tr>
                </tbody>
            </Table>
        );
        const caption = screen.getByTestId("caption");
        expect(caption.tagName).toBe("CAPTION");
        expect(caption).toHaveAttribute("data-slot", "table-caption");
        expect(caption).toHaveTextContent("Table Description");
    });
});
