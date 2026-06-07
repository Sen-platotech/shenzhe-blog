module.exports = {
  clearMocks: true,
  collectCoverage: false,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  roots: ['<rootDir>/__tests__/lib/content', '<rootDir>/__tests__/pages/api'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  verbose: true
}
