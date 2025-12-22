import { vi } from 'vitest'

export const mockConfigurationService = {
  getAuthEndpoint: vi.fn(),
  getTokenEndpoint: vi.fn(),
  getUserInfoEndpoint: vi.fn(),
  getLogoutEndpoint: vi.fn(),
}

vi.mock(import('../../../src/oidc/ConfigurationService.js'), () => ({
  ConfigurationService: vi.fn(function () {
    return mockConfigurationService
  }),
}))
