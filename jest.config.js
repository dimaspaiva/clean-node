module.exports = {
  roots: ['<rootDir>/src'],
  preset: '@shelf/jest-mongodb',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/protocols/**/*.ts',
    '!<rootDir>/src/**/*protocols.ts',
    '!<rootDir>/src/**/domain/**/*.ts',
    '!<rootDir>/src/main/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
