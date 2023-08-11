/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'prettier', 'plugin:mdx/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2015
  },
  settings: {
    'mdx/code-blocks': true,
    'mdx/language-mapper': {}
  },
  ignorePatterns: ['node_modules/', 'package.json', 'pnpm-lock.yaml'],
  rules: {
    'react/jsx-no-undef': 'off'
  }
};
