import { vi } from 'vitest'

export const mockExpirationService = {
  watchExpiration: vi.fn(),
}

vi.mock(import('../../../src/oidc/ExpirationService.js'), () => ({
  ExpirationService: vi.fn(function () {
    return mockExpirationService
  }),
}))
