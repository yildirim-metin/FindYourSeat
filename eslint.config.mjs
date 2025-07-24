import js from '@eslint/js';
import globals from 'globals';

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      'semi': ['warn', 'always'],
      'camelcase': ['warn', { properties: 'always' }],
      'no-var': 'warn',
      'prefer-const': 'warn',

      'new-cap': ['warn', {
        newIsCap: true,
        capIsNew: false,
      }],
    }
  }
];
