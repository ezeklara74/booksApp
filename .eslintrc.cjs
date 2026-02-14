module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
      // Use the automatic runtime for React 17+ so 'React' import is not required in files
      pragma: 'React',
      fragment: 'Fragment',
    },
  },
  rules: {
    // Allow the automatic JSX runtime (no need to have `React` in scope)
    'react/react-in-jsx-scope': 'off',
    // project-specific rules can go here
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
    },
  ],
}
