import { vi, describe, it, expect, afterAll, beforeEach, beforeAll } from 'vitest'

import { mockLocalStorage } from '../mocks/LocalStorage.mock.js'
import { StorageService } from '../../src/oidc/StorageService.js'

const redirectUri = 'https://app.com/'
const verifier = 'abc'
const auth = {
  access_token: 'access-token',
  refresh_token: 'refresh_token',
  id_token: 'id-token',
  expires_at: 123,
  user_info: { roles: ['ROLE_ADMIN'] },
}

let unit

beforeAll(() => {
  global.localStorage = mockLocalStorage
})

beforeEach(() => {
  unit = new StorageService()
  vi.clearAllMocks()
})

afterAll(() => {
  delete global.localStorage
})

describe('StorageService', function () {

  it('setAuth', function () {
    // WHEN
    unit.setAuth(auth)

    // THEN
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith(unit.AUTH, JSON.stringify(auth))
  })

  it('setUserInfo', function () {
    // GIVEN
    const newUserInfo = { roles: ['ROLE_STUDENT'] }
    const expectedAuth = { ...auth, user_info: newUserInfo }

    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    unit.setUserInfo(newUserInfo)

    // THEN
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith(unit.AUTH, JSON.stringify(expectedAuth))
  })

  it('getAuth', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    const actualResult = unit.getAuth()

    // THEN
    expect(actualResult).toEqual(auth)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('getUserInfo', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    const actualResult = unit.getUserInfo()

    // THEN
    expect(actualResult).toEqual(auth.user_info)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('getUserClaim', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    const actualResult = unit.getUserClaim('roles')

    // THEN
    expect(actualResult).toEqual(auth.user_info.roles)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('getExpiration', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    const actualResult = unit.getExpiration()

    // THEN
    expect(actualResult).toEqual(auth.expires_at)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('getIdToken', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    const actualResult = unit.getIdToken()

    // THEN
    expect(actualResult).toEqual(auth.id_token)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('getAccessToken', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    const actualResult = unit.getAccessToken()

    // THEN
    expect(actualResult).toEqual(auth.access_token)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('getRefreshToken', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(JSON.stringify(auth))

    // WHEN
    const actualResult = unit.getRefreshToken()

    // THEN
    expect(actualResult).toEqual(auth.refresh_token)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('removeAuth', function () {
    // WHEN
    unit.removeAuth()

    // THEN
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1)
    expect(localStorage.removeItem).toHaveBeenCalledWith(unit.AUTH)
  })

  it('setRedirectUri', function () {
    // WHEN
    unit.setRedirectUri(redirectUri)

    // THEN
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith(unit.ACTIVE_REDIRECT_URI, redirectUri)
  })

  it('getRedirectUri', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(redirectUri)

    // WHEN
    const actualResult = unit.getRedirectUri()

    // THEN
    expect(actualResult).toEqual(redirectUri)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('removeRedirectUri', function () {
    // WHEN
    unit.removeRedirectUri()

    // THEN
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1)
    expect(localStorage.removeItem).toHaveBeenCalledWith(unit.ACTIVE_REDIRECT_URI)
  })

  it('setVerifier', function () {
    // WHEN
    unit.setVerifier(verifier)

    // THEN
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith(unit.VERIFIER, verifier)
  })

  it('getVerifier', function () {
    // GIVEN
    localStorage.getItem.mockReturnValue(verifier)

    // WHEN
    const actualResult = unit.getVerifier()

    // THEN
    expect(actualResult).toEqual(verifier)
    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('removeVerifier', function () {
    // WHEN
    unit.removeVerifier()

    // THEN
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1)
    expect(localStorage.removeItem).toHaveBeenCalledWith(unit.VERIFIER)
  })
})
