import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {ignores: ['dist']},
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {jsx: true},
        sourceType: 'module'
      }
    },
    settings: {react: {version: '18.3'}},
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'no-var': 'error',
      'no-multiple-empty-lines': 'error',
      'no-console': 'off',
      eqeqeq: 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-key': 'error',
      'line-break-style': 'off',
      'no-unused-vars': 'error',
      'no-useless-catch': 'error',
      'dot-notation': 'error',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': ['warn', {allowConstantExport: true}]
    }
  }
];
