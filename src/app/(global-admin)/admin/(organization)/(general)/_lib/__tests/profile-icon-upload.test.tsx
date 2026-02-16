import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ProfileIconUpload } from "../components/profile-icon-upload";

describe("ProfileIconUpload", () => {
    it("renders Profile Icon label", () => {
        renderWithProviders(
            <ProfileIconUpload profileIconUrl={null} orgName="Test Org" />
        );

        expect(screen.getByText("Profile Icon")).toBeVisible();
    });

    it("shows drop zone when no image", () => {
        renderWithProviders(
            <ProfileIconUpload profileIconUrl={null} orgName="Test Org" />
        );

        const fileInput = document.querySelector('input[name="profileIcon"]');
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute("accept", "image/*");
    });

    it("shows current image and Change/Remove when profileIconUrl is set", () => {
        renderWithProviders(
            <ProfileIconUpload
                profileIconUrl="https://example.com/icon.png"
                orgName="Test Org"
            />
        );

        const img = screen.getByRole("img", {
            name: /test org profile icon/i,
        });
        expect(img).toBeVisible();
        expect(img).toHaveAttribute("src", "https://example.com/icon.png");

        expect(
            screen.getByRole("button", { name: /change profile icon/i })
        ).toBeVisible();
        expect(screen.getByRole("button", { name: "Remove" })).toBeVisible();
    });

    it("file input has correct name and accept", () => {
        renderWithProviders(
            <ProfileIconUpload profileIconUrl={null} orgName="Test Org" />
        );

        const input = document.querySelector('input[name="profileIcon"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("name", "profileIcon");
        expect(input).toHaveAttribute("accept", "image/*");
    });

    it("clicking Remove clears image and shows drop zone", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ProfileIconUpload
                profileIconUrl="https://example.com/icon.png"
                orgName="Test Org"
            />
        );

        await user.click(screen.getByRole("button", { name: "Remove" }));

        expect(
            screen.queryByRole("img", { name: /test org profile icon/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Remove" })
        ).not.toBeInTheDocument();
    });

    it("adds removeProfileIcon hidden input when Remove is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ProfileIconUpload
                profileIconUrl="https://example.com/icon.png"
                orgName="Test Org"
            />
        );

        await user.click(screen.getByRole("button", { name: "Remove" }));

        const hidden = document.querySelector(
            'input[type="hidden"][name="removeProfileIcon"]'
        );
        expect(hidden).toBeInTheDocument();
        expect(hidden).toHaveAttribute("value", "on");
    });

    it("clicking Change button triggers file input", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ProfileIconUpload
                profileIconUrl="https://example.com/icon.png"
                orgName="Test Org"
            />
        );

        const changeButton = screen.getByRole("button", {
            name: /change profile icon/i,
        });
        const fileInput = document.querySelector('input[name="profileIcon"]');
        const clickSpy = vi.spyOn(fileInput as HTMLInputElement, "click");

        await user.click(changeButton);

        expect(clickSpy).toHaveBeenCalledTimes(1);
        clickSpy.mockRestore();
    });
});
