import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import jest from 'eslint-plugin-jest'

export default [
  {
    files: ['**/*.js'],

    languageOptions: {
      globals: {
        ...globals.browser,
        global: 'writable',
      },
    },

    plugins: {
      js,
      jest,
      '@stylistic': stylistic,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...jest.configs.recommended.rules,
      ...stylistic.configs.recommended.rules,

      '@stylistic/padded-blocks': 'off',
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
    },
  },

  {
    ignores: ['dist/'],
  },
]
