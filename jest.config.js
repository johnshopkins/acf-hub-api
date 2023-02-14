module.exports = {
  moduleNameMapper: {
    api: '<rootDir>/tests/jest/__mocks__/api.js',

    // see: https://stackoverflow.com/a/54646930
    '\\.(css|scss)$': '<rootDir>/tests/jest/__mocks__/styleMock.js',

    // see: https://stackoverflow.com/a/73203803
    uuid: require.resolve('uuid'),
  },
};
