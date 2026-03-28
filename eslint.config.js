import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
      },
    },
  },
  {
    files: ["src/**/*.ts", "vite.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["src/**/*.vue"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["src/**/*.{ts,vue}", "vite.config.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // Enable when the codebase has return types on handlers; very noisy on Vue SFCs today.
      "@typescript-eslint/explicit-function-return-type": "off",
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/define-props-declaration": ["error", "type-based"],
      "vue/multi-word-component-names": "off",
      "vue/no-unused-vars": "error",
    },
  },
  {
    files: ["vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["src/components/chat/FootnoteText.vue", "src/components/chat/ReferencesSection.vue"],
    rules: {
      // Rule snippets from the API are treated as trusted HTML for display.
      "vue/no-v-html": "off",
    },
  },
  {
    files: ["eslint.config.js", "scripts/**/*.js", "deploy.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "module",
    },
  },
  eslintConfigPrettier,
);
