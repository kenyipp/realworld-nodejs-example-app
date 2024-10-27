/** @type {import('jest').Config} */

const config = {
  preset: 'ts-jest',
  verbose: false,
  modulePathIgnorePatterns: ['<rootDir>/aws/scripts/', '<rootDir>/node_modules/'],
  testEnvironment: 'node'
};

module.exports = config;
