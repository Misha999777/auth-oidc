import {jest} from '@jest/globals'

export const mockEnvUtils = {
  isElectron: jest.fn(),
  isCapacitorNative: jest.fn()
}

jest.unstable_mockModule('../../src/utils/EnvUtils.js', () => mockEnvUtils)
