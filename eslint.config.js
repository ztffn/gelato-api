import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import jestPlugin from "eslint-plugin-jest";
import path from "path";
import { fileURLToPath } from "url";

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  // Base configuration for TypeScript files
  {
    files: ["src/**/*.ts", "e2e/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    // Start with recommended rules from @typescript-eslint/eslint-plugin
    // These are rule settings, not full config objects.
    rules: tsPlugin.configs.recommended.rules,
  },
  // Layer additional stricter rule sets if desired.
  // For example, to add 'strict' rules (these are also just rule settings):
  // {
  //   files: ["src/**/*.ts", "e2e/**/*.ts"], // ensure correct files
  //   rules: {
  //     ...tsPlugin.configs.strict.rules,
  //   }
  // },
  // Note: If `tsPlugin.configs.recommended` or `strict` were full config objects
  // (like those from tseslint.config() helper), you would spread them:
  // ...tsPlugin.configs.whateverFullConfig,

  // Jest configuration
  // jestPlugin.configs['flat/recommended'] is a full configuration object
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "e2e/**/*.ts"],
    ...jestPlugin.configs['flat/recommended'], // Spread the flat config object
    // You can override rules from flat/recommended here if needed
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      // Example: 'jest/no-focused-tests': 'error', 
    }
  }
];
