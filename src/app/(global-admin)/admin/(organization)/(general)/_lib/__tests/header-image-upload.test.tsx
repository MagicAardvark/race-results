import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { HeaderImageUpload } from "../components/header-image-upload";

describe("HeaderImageUpload", () => {
    it("renders Header Image label", () => {
        renderWithProviders(
            <HeaderImageUpload headerImageUrl={null} orgName="Test Org" />
        );

        expect(screen.getByText("Header Image")).toBeVisible();
    });

    it("shows drop zone when no image", () => {
        renderWithProviders(
            <HeaderImageUpload headerImageUrl={null} orgName="Test Org" />
        );

        expect(screen.getByText("Select image to upload")).toBeVisible();
        expect(screen.getByText("or drag and drop")).toBeVisible();
        expect(screen.getByLabelText(/select image/i)).toBeInTheDocument();
    });

    it("shows current image and Change/Remove when headerImageUrl is set", () => {
        renderWithProviders(
            <HeaderImageUpload
                headerImageUrl="https://example.com/header.jpg"
                orgName="Test Org"
            />
        );

        const img = screen.getByRole("img", { name: /test org header/i });
        expect(img).toBeVisible();
        expect(img).toHaveAttribute("src", "https://example.com/header.jpg");

        expect(
            screen.getByRole("button", { name: /change header image/i })
        ).toBeVisible();
        expect(screen.getByRole("button", { name: "Remove" })).toBeVisible();
    });

    it("file input has correct name and accept", () => {
        renderWithProviders(
            <HeaderImageUpload headerImageUrl={null} orgName="Test Org" />
        );

        const input = screen.getByLabelText(/select image to upload/i);
        expect(input).toHaveAttribute("name", "headerImage");
        expect(input).toHaveAttribute("accept", "image/*");
    });

    it("clicking Remove clears image and shows drop zone", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <HeaderImageUpload
                headerImageUrl="https://example.com/header.jpg"
                orgName="Test Org"
            />
        );

        await user.click(screen.getByRole("button", { name: "Remove" }));

        expect(screen.getByText("Select image to upload")).toBeVisible();
        expect(
            screen.queryByRole("img", { name: /test org header/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Remove" })
        ).not.toBeInTheDocument();
    });

    it("adds removeHeaderImage hidden input when Remove is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <HeaderImageUpload
                headerImageUrl="https://example.com/header.jpg"
                orgName="Test Org"
            />
        );

        await user.click(screen.getByRole("button", { name: "Remove" }));

        const hidden = document.querySelector(
            'input[type="hidden"][name="removeHeaderImage"]'
        );
        expect(hidden).toBeInTheDocument();
        expect(hidden).toHaveAttribute("value", "on");
    });

    it("clicking Change button triggers file input", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <HeaderImageUpload
                headerImageUrl="https://example.com/header.jpg"
                orgName="Test Org"
            />
        );

        const changeButton = screen.getByRole("button", {
            name: /change header image/i,
        });
        const fileInput = document.querySelector('input[name="headerImage"]');
        const clickSpy = vi.spyOn(fileInput as HTMLInputElement, "click");

        await user.click(changeButton);

        expect(clickSpy).toHaveBeenCalledTimes(1);
        clickSpy.mockRestore();
    });
});
