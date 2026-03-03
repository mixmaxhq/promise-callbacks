module.exports = {
  projects: [
    {
      displayName: 'jsdom',
      rootDir: __dirname,
      roots: ['<rootDir>/src'],
      testEnvironment: 'jsdom',
      testRegex: '.*\\.test\\.ts$',
    },
    {
      displayName: 'node',
      rootDir: __dirname,
      roots: ['<rootDir>/src'],
      testEnvironment: 'node',
      testRegex: '.*\\.test\\.ts$',
    },
  ],
};
