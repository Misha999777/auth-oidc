import { jest } from '@jest/globals'

export const mockConfigurationService = {
  getAuthEndpoint: jest.fn(),
  getTokenEndpoint: jest.fn(),
  getUserInfoEndpoint: jest.fn(),
  getLogoutEndpoint: jest.fn(),
}

jest.unstable_mockModule('../../src/oidc/ConfigurationService.js', () => ({
  ConfigurationService: jest.fn().mockImplementation(() => mockConfigurationService),
}))
