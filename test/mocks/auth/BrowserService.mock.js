import { jest } from '@jest/globals'

export const mockBrowserService = {
  pageLoaded: jest.fn(),
}

jest.unstable_mockModule('../../src/auth/BrowserService.js', () => ({
  BrowserService: jest.fn().mockImplementation(() => mockBrowserService),
}))
