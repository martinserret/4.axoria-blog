import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginReact from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: eslintPluginReact,
    },
    settings: {
      react: {
        version: "detect",
        runtime: "automatic", // pour éviter l’erreur "React must be in scope"
      },
    },
    rules: {
      // Règles personnalisées
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      indent: ["warn", 2],
      quotes: ["warn", "double"],
      semi: ["error", "always"],
      eqeqeq: ["error", "always"],
      "no-console": "warn",
      "jsx-quotes": ["warn", "prefer-double"],
      "react/jsx-indent": ["warn", 2],
      "react/jsx-indent-props": ["warn", 2],
      "object-curly-spacing": ["error", "always"],
      "react/react-in-jsx-scope": "off", // inutile avec React 17+
    },
  },
  ...compat.config({
    extends: ["next/core-web-vitals"], // ⚠️ uniquement des règles générales
  }),
  {
    rules: {
      "react/no-unescaped-entities": "off", // Force la désactivation ici après le passage de compat
    },
  }
];

export default eslintConfig;
