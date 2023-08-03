module.exports = {
    rootDir: '.',
    preset: 'ts-jest',
    testEnvironment: 'node',

    testMatch: [
        '**/tests/database/integration/*.ts',
        '**/tests/database/unit/*.ts'
    ],
};