import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "src/components/ui/**",
    ]),
    eslint.configs.recommended,
    {
        rules: {
            "no-console": [
                "warn",
                {
                    allow: ["error", "warn"],
                },
            ],
            curly: "error",
            "prefer-template": "error",

            "spaced-comment": [
                "error",
                "always",
                {
                    markers: ["/"],
                },
            ],
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            semi: ["error", "always"],
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
        },
    },
    prettier,
]);
