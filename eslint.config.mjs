import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
    {
        rules: {
            // Console logging
            "no-console": ["warn", { allow: ["error", "warn"] }],

            // Code style
            curly: "error",
            "prefer-template": "error",
            "spaced-comment": ["error", "always", { markers: ["/"] }],
            semi: ["error", "always"],
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],

            // TypeScript handles these better than ESLint
            "no-unused-vars": "off",
            "no-undef": "off",

            // TypeScript unused vars
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
    prettier,
]);
