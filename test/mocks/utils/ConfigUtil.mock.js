import {jest} from '@jest/globals'

export const mockConfigUtils = {
  populateDefaults: jest.fn(),
  defaultErrorHandler: jest.fn()
}

jest.unstable_mockModule('../../src/utils/ConfigUtil.js', () => mockConfigUtils)
