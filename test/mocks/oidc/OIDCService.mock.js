import { vi } from 'vitest'

export const mockOIDCService = {
  signInRedirect: vi.fn(),
  signInRedirectCallback: vi.fn(),
  signInSilent: vi.fn(),
  signOutRedirect: vi.fn(),
  isLoggedIn: vi.fn(),
  isLoggingIn: vi.fn(),
  cancelLogin: vi.fn(),
}

vi.mock(import('../../../src/oidc/OIDCService.js'), () => ({
  OIDCService: vi.fn(function () {
    return mockOIDCService
  }),
}))
