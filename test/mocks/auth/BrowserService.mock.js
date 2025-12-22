import { vi } from 'vitest'

export const mockBrowserService = {
  pageLoaded: vi.fn(),
}

vi.mock(import('../../../src/auth/BrowserService.js'), () => ({
  BrowserService: vi.fn(function () {
    return mockBrowserService
  }),
}))
