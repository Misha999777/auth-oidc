import {jest} from '@jest/globals'

export const mockExpirationService = {
  watchExpiration: jest.fn()
}

jest.unstable_mockModule('../../src/oidc/ExpirationService.js', () => ({
  ExpirationService: jest.fn().mockImplementation(() => mockExpirationService),
}))
