import { jest, describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals'

import { mockJson, mockFetch } from '../mocks/Fetch.mock.js'
import { mockConfigurationService } from '../mocks/oidc/ConfigurationService.mock.js'
import { mockStorageService } from '../mocks/oidc/StorageService.mock.js'
import '../mocks/oidc/ExpirationService.mock.js'

const { OIDCService } = await import('../../src/oidc/OIDCService.js')

const authorityUrl = 'https://server.com/project'
const authUrl = authorityUrl + '/auth'
const tokenUrl = authorityUrl + '/token'
const userInfoUrl = authorityUrl + '/user-info'
const logoutUrl = authorityUrl + '/logout'
const clientId = 'client'
const redirectUri = 'https://app.com'
const code = 'code'
const accessToken = 'access-token'
const refreshToken = 'refresh-token'
const idToken = 'id-token'
const challenge = 'f2LwESBr8ezpvlZBEeqfvb4yeNpHC5Nc90_scF04hgM'
const verifier = 'AQIDBA'

let unit

beforeAll(() => {
  jest.useFakeTimers()
  global.setInterval = jest.fn()
  global.window = { location: { replace: jest.fn(), reload: jest.fn() }, crypto: { getRandomValues: jest.fn() } }
  global.fetch = mockFetch
})

beforeEach(() => {
  unit = new OIDCService(authorityUrl, clientId)
  jest.clearAllMocks()
})

afterAll(() => {
  jest.useRealTimers()
  delete global.setInterval
  delete global.window
  delete global.fetch
})

describe('ConfigurationService signInRedirect', function () {

  it('nominal', async function () {
    // GIVEN
    const expectedAuthUri = authUrl + '?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(redirectUri)
      + '&response_type=code&scope=openid' + '&code_challenge=' + challenge + '&code_challenge_method=S256'

    mockConfigurationService.getAuthEndpoint.mockReturnValue(authUrl)
    window.crypto.getRandomValues.mockImplementation(() => new Uint8Array([1, 2, 3, 4]))

    // WHEN
    await unit.signInRedirect(redirectUri)

    // THEN
    expect(mockConfigurationService.getAuthEndpoint).toHaveBeenCalledTimes(1)

    expect(window.crypto.getRandomValues).toHaveBeenCalledTimes(1)
    expect(window.crypto.getRandomValues).toHaveBeenCalledWith(new Uint8Array(64))

    expect(mockStorageService.setRedirectUri).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setRedirectUri).toHaveBeenCalledWith(redirectUri)

    expect(mockStorageService.setVerifier).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setVerifier).toHaveBeenCalledWith(verifier)

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith(expectedAuthUri)
  })
})

describe('ConfigurationService signInRedirectCallback', function () {

  it('nominal', async function () {
    // GIVEN
    const expectedAuthFetchParams = {
      method: 'POST',
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    }
    const serverAuth = { expires_in: 10 }
    const expectedAuth = { ...serverAuth, expires_at: Date.now() + serverAuth.expires_in * 1000 }

    mockConfigurationService.getTokenEndpoint.mockReturnValue(tokenUrl)
    mockStorageService.getRedirectUri.mockReturnValue(redirectUri)
    mockStorageService.getVerifier.mockReturnValue(verifier)
    mockJson.mockResolvedValueOnce(serverAuth)

    unit._getUserInfo = jest.fn()

    // WHEN
    await unit.signInRedirectCallback(code)

    // THEN
    expect(mockConfigurationService.getTokenEndpoint).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getRedirectUri).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(tokenUrl, expectedAuthFetchParams)
    expect(mockJson).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setAuth).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setAuth).toHaveBeenCalledWith(expectedAuth)

    expect(unit._getUserInfo).toHaveBeenCalledTimes(1)
  })
})

describe('ConfigurationService signInSilent', function () {

  it('nominal', async function () {
    // GIVEN
    const expectedRefreshFetchParams = {
      method: 'POST',
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        client_id: clientId,
      }),
    }
    const serverAuth = { expires_in: 10 }
    const oldUserInfo = { name: 'user' }
    const expectedAuth = {
      ...serverAuth,
      expires_at: Date.now() + serverAuth.expires_in * 1000,
      userInfo: oldUserInfo,
    }

    mockConfigurationService.getTokenEndpoint.mockReturnValue(tokenUrl)
    mockStorageService.getRefreshToken.mockReturnValue(refreshToken)
    mockJson.mockResolvedValueOnce(serverAuth)
    mockStorageService.getUserInfo.mockReturnValue(oldUserInfo)

    unit._getUserInfo = jest.fn()

    // WHEN
    await unit.signInSilent()

    // THEN
    expect(mockConfigurationService.getTokenEndpoint).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getRefreshToken).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(tokenUrl, expectedRefreshFetchParams)
    expect(mockJson).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setAuth).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setAuth).toHaveBeenCalledWith(expectedAuth)

    expect(unit._getUserInfo).toHaveBeenCalledTimes(1)
  })
})

describe('ConfigurationService signOutRedirect', function () {

  it('nominal', async function () {
    // GIVEN
    const expectedLogoutUri = logoutUrl + '?post_logout_redirect_uri=' + encodeURIComponent(redirectUri)
      + '&id_token_hint=' + idToken
    mockConfigurationService.getLogoutEndpoint.mockReturnValue(logoutUrl)
    mockStorageService.getIdToken.mockReturnValue(idToken)

    // WHEN
    await unit.signOutRedirect(redirectUri)

    // THEN
    expect(mockConfigurationService.getLogoutEndpoint).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getIdToken).toHaveBeenCalledTimes(1)

    expect(mockStorageService.removeAuth).toHaveBeenCalledTimes(1)

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith(expectedLogoutUri)
  })
})

describe('ConfigurationService _getUserInfo', function () {

  it('nominal', async function () {
    // GIVEN
    const expectedUserInfoFetchParams = {
      method: 'GET',
      headers: [['Authorization', 'Bearer ' + accessToken]],
    }
    const serverUserInfo = { sub: 'user' }

    mockConfigurationService.getUserInfoEndpoint.mockReturnValue(userInfoUrl)
    mockStorageService.getAccessToken.mockReturnValue(accessToken)
    mockJson.mockResolvedValueOnce(serverUserInfo)

    // WHEN
    await unit._getUserInfo()

    // THEN
    expect(mockConfigurationService.getUserInfoEndpoint).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getAccessToken).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(userInfoUrl, expectedUserInfoFetchParams)
    expect(mockJson).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setUserInfo).toHaveBeenCalledTimes(1)
    expect(mockStorageService.setUserInfo).toHaveBeenCalledWith(serverUserInfo)
  })
})

describe('ConfigurationService isLoggedIn', function () {

  it('nominal', async function () {
    // GIVEN
    mockStorageService.getAuth.mockReturnValue({})
    mockStorageService.getUserInfo.mockReturnValue({})

    // WHEN
    expect(await unit.isLoggedIn())
      .toBeTruthy()

    // THEN
    expect(mockStorageService.getAuth).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getUserInfo).toHaveBeenCalledTimes(1)
  })

  it('no user info', async function () {
    // GIVEN
    mockStorageService.getAuth.mockReturnValue({})
    mockStorageService.getUserInfo.mockReturnValue(undefined)

    // WHEN
    expect(await unit.isLoggedIn())
      .toBeFalsy()

    // THEN
    expect(mockStorageService.getAuth).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getUserInfo).toHaveBeenCalledTimes(1)
  })

  it('no auth', async function () {
    // GIVEN
    mockStorageService.getAuth.mockReturnValue(undefined)
    mockStorageService.getUserInfo.mockReturnValue({})

    // WHEN
    expect(await unit.isLoggedIn())
      .toBeFalsy()

    // THEN
    expect(mockStorageService.getAuth).toHaveBeenCalledTimes(1)
  })
})

describe('ConfigurationService isLoggingIn', function () {

  it('nominal', async function () {
    // GIVEN
    mockStorageService.getRedirectUri.mockReturnValue('123')

    // WHEN
    expect(await unit.isLoggingIn())
      .toBeTruthy()

    // THEN
    expect(mockStorageService.getRedirectUri).toHaveBeenCalledTimes(1)
  })

  it('no redirect uri', async function () {
    // GIVEN
    mockStorageService.getRedirectUri.mockReturnValue(undefined)

    // WHEN
    expect(await unit.isLoggingIn())
      .toBeFalsy()

    // THEN
    expect(mockStorageService.getRedirectUri).toHaveBeenCalledTimes(1)
  })
})

describe('ConfigurationService cancelLogin', function () {

  it('nominal', async function () {
    // WHEN
    await unit.cancelLogin()

    // THEN
    expect(mockStorageService.removeRedirectUri).toHaveBeenCalledTimes(1)
  })
})

describe('WATCHER_ACTIONS checkExpiration', function () {

  it('nominal', async function () {
    // GIVEN
    unit.isLoggedIn = jest.fn()
    unit.isLoggedIn.mockReturnValue(true)
    mockStorageService.getExpiration.mockReturnValue(Date.now())

    // WHEN
    expect(await unit.WATCHER_ACTIONS.checkExpiration())
      .toBeTruthy()

    // THEN
    expect(unit.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getExpiration).toHaveBeenCalledTimes(1)
  })

  it('not expired', async function () {
    // GIVEN
    unit.isLoggedIn = jest.fn()
    unit.isLoggedIn.mockReturnValue(true)
    mockStorageService.getExpiration.mockReturnValue(Date.now() + 30000)

    // WHEN
    expect(await unit.WATCHER_ACTIONS.checkExpiration())
      .toBeFalsy()

    // THEN
    expect(unit.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(mockStorageService.getExpiration).toHaveBeenCalledTimes(1)
  })

  it('not logged in', async function () {
    // GIVEN
    unit.isLoggedIn = jest.fn()
    unit.isLoggedIn.mockReturnValue(false)

    // WHEN
    expect(await unit.WATCHER_ACTIONS.checkExpiration())
      .toBeFalsy()

    // THEN
    expect(unit.isLoggedIn).toHaveBeenCalledTimes(1)
  })
})

describe('WATCHER_ACTIONS forgetSession', function () {

  it('nominal', async function () {
    // WHEN
    await unit.WATCHER_ACTIONS.forgetSession()

    // THEN
    expect(mockStorageService.removeAuth).toHaveBeenCalledTimes(1)
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})

describe('WATCHER_ACTIONS reload', function () {

  it('nominal', async function () {
    // WHEN
    await unit.WATCHER_ACTIONS.reload()

    // THEN
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})

describe('WATCHER_ACTIONS refresh', function () {

  it('nominal', async function () {
    // GIVEN
    unit.signInSilent = jest.fn()

    // WHEN
    await unit.WATCHER_ACTIONS.refresh()

    // THEN
    expect(unit.signInSilent).toHaveBeenCalledTimes(1)
  })
})
