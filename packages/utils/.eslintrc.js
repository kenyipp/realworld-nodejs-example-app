const defaultConfig = require('@conduit/config/.eslintrc.json');

module.exports = {
  ...defaultConfig,
  parserOptions: {
    project: './tsconfig.json'
  }
};
