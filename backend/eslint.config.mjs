import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'dist/',
      'dist-worker/',
      '.wrangler/',
      'node_modules/',
      '**/generated/**',
      'prisma/migrations/',
    ],
  },

  // Base configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Project settings
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.worker,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      'no-console': 'warn',
    },
  },
)
