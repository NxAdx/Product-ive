/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:react-native|@react-native|@react-navigation|expo(?:nent)?|@expo(?:nent)?/.*|expo-.*|@expo-google-fonts/.*|@shopify/flash-list|react-native-svg)/)',
  ],
  collectCoverageFrom: [
    'src/store/**/*.ts',
    'src/db/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
