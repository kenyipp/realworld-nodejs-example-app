const defaultConfig = require('@conduit/config/.eslintrc.json');

module.exports = {
  ...defaultConfig,
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    ...defaultConfig.rules,
    'import/no-extraneous-dependencies': 'off'
  }
};
