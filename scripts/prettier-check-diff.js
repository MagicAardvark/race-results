#!/usr/bin/env node
// Check Prettier formatting and show diffs for files that fail
/* eslint-disable @typescript-eslint/no-require-imports, no-console */

const { execSync } = require("child_process");
const fs = require("fs");

let files = [];

try {
    // Get list of files with formatting issues
    // This will exit with code 1 if files are found, but we want the output
    const output = execSync("pnpm prettier --list-different .", {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"], // Capture stdout, stderr, but ignore stderr
    });
    files = output
        .trim()
        .split("\n")
        .filter((f) => f.length > 0);
} catch (error) {
    // execSync throws when exit code is non-zero, but we want the stdout
    // Prettier exits with code 1 when files need formatting, but still outputs the file list
    if (error.stdout) {
        files = error.stdout
            .trim()
            .split("\n")
            .filter((f) => f.length > 0);
    }
    // If no stdout, there are no files to format (or error occurred)
}

if (files.length === 0) {
    // No issues, run normal check
    try {
        execSync("pnpm prettier --check .", { stdio: "inherit" });
        process.exit(0);
    } catch (error) {
        process.exit(error.status || 1);
    }
}

console.log("Prettier found formatting issues. Showing diffs:\n");

for (const file of files) {
    console.log(`=== ${file} ===`);

    try {
        // Read original file
        const original = fs.readFileSync(file, "utf8");

        // Get formatted version
        const formatted = execSync(`pnpm prettier "${file}"`, {
            encoding: "utf8",
        });

        // Simple diff output
        const originalLines = original.split("\n");
        const formattedLines = formatted.split("\n");

        console.log("--- Original");
        console.log("+++ Formatted");

        // Show a simple comparison
        const maxLines = Math.max(originalLines.length, formattedLines.length);
        for (let i = 0; i < maxLines; i++) {
            const orig = originalLines[i] || "";
            const fmt = formattedLines[i] || "";

            if (orig !== fmt) {
                if (orig) console.log(`-${orig}`);
                if (fmt) console.log(`+${fmt}`);
            }
        }

        console.log("");
    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
    }
}

process.exit(1);
