module.exports = {
    'root': true,
    'env': {
      'browser': true,
      'es6': true,
      // "react-native/react-native": true,
    },
    "settings": {
      "react": {
        "createClass": "createReactClass",
        "pragma": "React",
        "version": "detect",
        "flowVersion": "0.53",
      }
    },
    'extends': [
      'plugin:@typescript-eslint/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'globals': {
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
      'ecmaFeatures': {
        'jsx': true,
      },
      'ecmaVersion': 2018,
      'sourceType': 'module',
      'project': './tsconfig.json',
    },
    'plugins': [
      '@typescript-eslint',
    ],
    'rules': {
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/explicit-function-return-type': [
        // 'warn',
        'off', 
        {
          allowExpressions: true, 
          allowTypedFunctionExpressions: true,
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/camelcase': ['off', {properties: 'always'}],
      '@typescript-eslint/no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'none',
        'ignoreRestSiblings': true,
      }],
    },
  };