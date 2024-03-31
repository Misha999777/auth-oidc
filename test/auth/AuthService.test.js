import {afterAll, beforeAll, beforeEach, describe, expect, it, jest} from '@jest/globals'

import {mockOIDCService} from '../mocks/oidc/OIDCService.mock.js'
import {mockStorageService} from '../mocks/oidc/StorageService.mock.js'
import {mockConfigUtils} from '../mocks/utils/ConfigUtil.mock.js'
import {mockEnvUtils} from '../mocks/utils/EnvUtils.mock.js'
import '../mocks/auth/BrowserService.mock.js'

const {AuthService} = await import('../../src/auth/AuthService.js')

const oidcConfig = {
  authority: 'https://auth.com/123',
  clientId: '123'
}
const config = {
  authority: 'https://auth.com/123',
  clientId: '123',
  autoLogin: false,
  errorHandler: mockConfigUtils.defaultErrorHandler,
  electronRedirectUrl: 'http://localhost/',
  capacitorRedirectUrl: 'http://localhost/'
}

let unit

beforeAll(() => {
  global.window = {
    location: {
      href: 'https://site.com/'
    }
  }
})

beforeEach(() => {
  mockConfigUtils.populateDefaults.mockReturnValue(config)
  unit = new AuthService(oidcConfig)
  jest.clearAllMocks()
})

afterAll(() => {
  delete global.window
})

describe('AuthService login', function () {

  it('nominal', async function () {
    //GIVEN
    mockOIDCService.signInRedirect.mockResolvedValue()
    unit._getUrl = jest.fn().mockReturnValue('url')

    //WHEN
    await unit.login()

    //THEN
    expect(mockOIDCService.signInRedirect).toHaveBeenCalledTimes(1)
    expect(mockOIDCService.signInRedirect).toHaveBeenCalledWith('url')
  })

  it('failed', async function () {
    //GIVEN
    mockOIDCService.signInRedirect.mockRejectedValue()
    unit._getUrl = jest.fn().mockReturnValue('url')

    //WHEN
    await unit.login()

    //THEN
    expect(mockOIDCService.signInRedirect).toHaveBeenCalledTimes(1)
    expect(mockOIDCService.signInRedirect).toHaveBeenCalledWith('url')
    expect(mockConfigUtils.defaultErrorHandler).toHaveBeenCalledTimes(1)
  })
})

describe('AuthService logout', function () {

  it('nominal', async function () {
    //GIVEN
    mockOIDCService.signOutRedirect.mockResolvedValue()
    unit._getUrl = jest.fn().mockReturnValue('url')

    //WHEN
    await unit.logout()

    //THEN
    expect(mockOIDCService.signOutRedirect).toHaveBeenCalledTimes(1)
    expect(mockOIDCService.signOutRedirect).toHaveBeenCalledWith('url')
  })

  it('failed', async function () {
    //GIVEN
    mockOIDCService.signOutRedirect.mockRejectedValue()
    unit._getUrl = jest.fn().mockReturnValue('url')

    //WHEN
    await unit.logout()

    //THEN
    expect(mockOIDCService.signOutRedirect).toHaveBeenCalledTimes(1)
    expect(mockOIDCService.signOutRedirect).toHaveBeenCalledWith('url')
    expect(mockConfigUtils.defaultErrorHandler).toHaveBeenCalledTimes(1)
  })
})

describe('AuthService _getUrl', function () {

  it('nominal', async function () {
    //GIVEN
    window.location.href = 'url'

    //WHEN
    expect(unit._getUrl()).toEqual('url')

    //THEN
    expect(mockEnvUtils.isElectron).toHaveBeenCalledTimes(1)
    expect(mockEnvUtils.isCapacitorNative).toHaveBeenCalledTimes(1)
  })

  it('capacitor', async function () {
    //GIVEN
    mockEnvUtils.isCapacitorNative.mockReturnValue(true)

    //WHEN
    expect(unit._getUrl()).toEqual(config.capacitorRedirectUrl)

    //THEN
    expect(mockEnvUtils.isCapacitorNative).toHaveBeenCalledTimes(1)
  })

  it('electron', async function () {
    //GIVEN
    mockEnvUtils.isCapacitorNative.mockReturnValue(false)
    mockEnvUtils.isElectron.mockReturnValue(true)

    //WHEN
    expect(unit._getUrl()).toEqual(config.electronRedirectUrl)

    //THEN
    expect(mockEnvUtils.isCapacitorNative).toHaveBeenCalledTimes(1)
    expect(mockEnvUtils.isElectron).toHaveBeenCalledTimes(1)
  })
})

describe('AuthService isLoggedIn', function () {

  it('nominal', function () {
    //GIVEN
    mockOIDCService.isLoggedIn.mockReturnValue(true)

    //WHEN
    expect(unit.isLoggedIn()).toBeTruthy()

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
  })

  it('not logged in', function () {
    //GIVEN
    mockOIDCService.isLoggedIn.mockReturnValue(false)

    //WHEN
    expect(unit.isLoggedIn()).toBeFalsy()

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
  })
})

describe('AuthService getUserInfo', function () {

  it('nominal', function () {
    //GIVEN
    mockOIDCService.isLoggedIn.mockReturnValue(true)
    mockStorageService.getUserClaim.mockReturnValue('info')

    //WHEN
    expect(unit.getUserInfo()).toEqual('info')

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getUserClaim).toHaveBeenCalledTimes(1)
  })

  it('not logged in', function () {
    //GIVEN
    mockOIDCService.isLoggedIn.mockReturnValue(false)

    //WHEN
    expect(unit.getUserInfo.bind(unit)).toThrow(new Error('No active auth or auth is in progress'))

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
  })
})

describe('AuthService getToken', function () {

  it('nominal', function () {
    //GIVEN
    mockOIDCService.isLoggedIn.mockReturnValue(true)
    mockStorageService.getAccessToken.mockReturnValue('token')

    //WHEN
    expect(unit.getToken()).toEqual('token')

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getAccessToken).toHaveBeenCalledTimes(1)
  })

  it('not logged in', function () {
    //GIVEN
    mockOIDCService.isLoggedIn.mockReturnValue(false)

    //WHEN
    expect(unit.getToken.bind(unit)).toThrow(new Error('No active auth or auth is in progress'))

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
  })
})

describe('AuthService tryToRefresh', function () {

  it('nominal', async function () {
    //GIVEN
    mockOIDCService.isLoggedIn.mockReturnValue(true)

    //WHEN
    await unit.tryToRefresh()

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(mockOIDCService.signInSilent).toHaveBeenCalledTimes(1)
  })

  it('not logged in', async function () {
    //GIVEN
    expect.assertions(2)
    mockOIDCService.isLoggedIn.mockReturnValue(false)

    //WHEN
    try {
      await unit.tryToRefresh()
    } catch (e) {
      expect(e.message).toMatch('No active auth or auth is in progress')
    }

    //THEN
    expect(mockOIDCService.isLoggedIn).toHaveBeenCalledTimes(1)
  })
})
