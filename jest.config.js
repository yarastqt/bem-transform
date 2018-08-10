'use strict'

module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.shared.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: [
    "**/tests/**/*.test.ts"
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
  ]
}
