import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockOIDCService } from '../mocks/oidc/OIDCService.mock.js'
import { mockConfigUtils } from '../mocks/utils/ConfigUtil.mock.js'

const { BrowserService } = await import('../../src/auth/BrowserService.js')

let isLoggedIn = vi.fn()
let login = vi.fn()

let unit

beforeAll(() => {
  global.window = {
    location: {
      href: 'https://site.com/',
    },
    history: {
      replaceState: vi.fn(),
    },
  }
})

beforeEach(() => {
  unit = new BrowserService(mockConfigUtils.defaultErrorHandler, true, mockOIDCService, isLoggedIn, login)
  vi.clearAllMocks()
})

afterAll(() => {
  delete global.window
})

describe('BrowserService pageLoaded', function () {

  it('nominal', function () {
    // GIVEN
    mockOIDCService.isLoggingIn.mockReturnValue(false)
    isLoggedIn.mockReturnValue(false)

    // WHEN
    unit.pageLoaded()

    // THEN
    expect(login).toHaveBeenCalledTimes(1)
  })

  it('failed', function () {
    // GIVEN
    mockOIDCService.isLoggingIn.mockReturnValue(true)
    window.location.href = 'https://site.com?error=123&error_description=123'

    // WHEN
    unit.pageLoaded()

    // THEN
    expect(mockOIDCService.cancelLogin).toHaveBeenCalledTimes(1)
    expect(window.history.replaceState).toHaveBeenCalledTimes(1)
    expect(window.history.replaceState).toHaveBeenCalledWith({}, '', 'https://site.com/')
    expect(login).toHaveBeenCalledTimes(1)
  })

  it('code', async function () {
    // GIVEN
    mockOIDCService.isLoggingIn.mockReturnValue(true)
    window.location.href = 'https://site.com?code=123'

    mockOIDCService.signInRedirectCallback.mockResolvedValue()

    // WHEN
    await unit.pageLoaded()

    // THEN
    expect(mockOIDCService.signInRedirectCallback).toHaveBeenCalledTimes(1)
    expect(mockOIDCService.signInRedirectCallback).toHaveBeenCalledWith('123')
    expect(mockOIDCService.cancelLogin).toHaveBeenCalledTimes(1)
    expect(window.location.href).toEqual('https://site.com/')
  })

  it('code failed', async function () {
    // GIVEN
    mockOIDCService.isLoggingIn.mockReturnValue(true)
    window.location.href = 'https://site.com?code=123'

    mockOIDCService.signInRedirectCallback.mockRejectedValue()

    // WHEN
    await unit.pageLoaded()

    // THEN
    expect(mockOIDCService.signInRedirectCallback).toHaveBeenCalledTimes(1)
    expect(mockOIDCService.signInRedirectCallback).toHaveBeenCalledWith('123')
    expect(mockOIDCService.cancelLogin).toHaveBeenCalledTimes(1)
    expect(window.history.replaceState).toHaveBeenCalledTimes(1)
    expect(window.history.replaceState).toHaveBeenCalledWith({}, '', 'https://site.com/')
    expect(mockConfigUtils.defaultErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockConfigUtils.defaultErrorHandler).toHaveBeenCalledWith('Auth failed: cant obtain token')
  })
})
