// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import pluginNext from '@next/eslint-plugin-next';
import parser from '@typescript-eslint/parser'; // If using TypeScript

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname, // Requires Node.js v20.11.0+ for import.meta.dirname
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next', // Basic Next.js rules
      // Optional extensions:
      // 'next/core-web-vitals', // For Core Web Vitals checks
      // 'next/typescript', // For TypeScript-specific rules
      // 'prettier', // If integrating with Prettier
    ],
  }),
  {
    // Custom rules or overrides
    languageOptions: {
      parser, // Use TypeScript parser if 'next/typescript' is extended
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      // Example: Override a rule from the extended configurations
      // 'react/no-unescaped-entities': 'off',
    },
  },
];

export default eslintConfig;
