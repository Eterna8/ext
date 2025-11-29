// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  prettierConfig,
  {
    ignores: [
      '.js',
      'docs',
      'proxy_server.js',
      'plugins/*/*\\[*\\]*.ts', // Files with square brackets in their names
    ],
  },
  {
    files: ['./plugins/*/*.ts', './plugins/multisrc/*/template.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'no-case-declarations': 'warn',
      'no-undef': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/fetch*'],
              message: 'Use @libs/fetch instead of @/lib/fetch',
            },
          ],
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts,js}'],
    ignores: [
      './plugins/*/*.ts',
      './plugins/multisrc/*/template.ts',
      '**/*.cjs',
    ],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-undef': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/fetch*'],
              message: 'Use @libs/fetch instead of @/lib/fetch',
            },
          ],
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.cjs', 'scripts/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
