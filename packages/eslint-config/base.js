import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// Shared file globs to avoid duplication across sub-configs
export const TS_FILES = ["**/*.ts", "**/*.tsx"];
export const JS_FILES = ["**/*.js", "**/*.jsx"];
export const ALL_FILES = [...TS_FILES, ...JS_FILES];

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.next/**", "**/out/**"],
  },

  // TypeScript files: enable type-aware linting. Each workspace/package should
  // have a tsconfig that includes its files. This override applies only to
  // .ts/.tsx so JS build output won't trigger tsconfig inclusion errors.
  {
    files: TS_FILES,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Keep `project: true` so type-aware rules work for TS files.
        // Note: each package should include the relevant tsconfig so eslint
        // doesn't complain about files not being included.
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs?.recommended?.rules,
      // stylistic may not exist in all versions; keep optional chaining
      ...tsPlugin.configs?.stylistic?.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },

  // JavaScript files: do not use type-aware parserOptions.project to avoid
  // TSConfig inclusion errors for build artifacts / config files.
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
