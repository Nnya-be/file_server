module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.js?(x)', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/', '/frontend/'],
  setupFiles: ['dotenv/config'],
};
