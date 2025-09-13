const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: { ...tsJestTransformCfg },
  // Reduzir paralelismo para evitar bugs de reporter em Node 20 / ambiente atual
  maxWorkers: 1,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testTimeout: 30000,
  // Diretório legacy removido – manter referência não causa erro mas limpamos
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  reporters: [ 'default' ],
};