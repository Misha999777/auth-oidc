import {jest} from '@jest/globals'

export const mockOIDCService = {
  signInRedirect: jest.fn(),
  signInRedirectCallback: jest.fn(),
  signInSilent: jest.fn(),
  signOutRedirect: jest.fn(),
  isLoggedIn: jest.fn(),
  isLoggingIn: jest.fn(),
  cancelLogin: jest.fn()
}

jest.unstable_mockModule('../../src/oidc/OIDCService.js', () => ({
  OIDCService: jest.fn().mockImplementation(() => mockOIDCService),
}))
