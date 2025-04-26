import { jest, describe, it, expect, afterAll, beforeEach, beforeAll } from '@jest/globals'
import { mockFetch, mockJson } from '../mocks/Fetch.mock.js'
import { ConfigurationService } from '../../src/oidc/ConfigurationService.js'

const authorityUrl = 'https://server.com/project'
const configurationEndpoint = authorityUrl + '/.well-known/openid-configuration'
const configuration = {
  authorization_endpoint: '/auth',
  token_endpoint: '/token',
  userinfo_endpoint: '/user',
  end_session_endpoint: '/logout',
}

let unit

beforeAll(() => {
  global.fetch = mockFetch
})

beforeEach(() => {
  unit = new ConfigurationService(authorityUrl)
  jest.clearAllMocks()
})

afterAll(() => {
  delete global.fetch
})

describe('ConfigurationService', function () {

  it('getAuthEndpoint', async function () {
    // GIVEN
    mockJson.mockResolvedValue(configuration)

    // WHEN
    expect(await unit.getAuthEndpoint())
      .toEqual('/auth')

    // THEN
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(configurationEndpoint, { method: 'GET' })
    expect(mockJson).toHaveBeenCalledTimes(1)
  })

  it('getTokenEndpoint', async function () {
    // GIVEN
    mockJson.mockResolvedValue(configuration)

    // WHEN
    expect(await unit.getTokenEndpoint())
      .toEqual('/token')

    // THEN
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(configurationEndpoint, { method: 'GET' })
    expect(mockJson).toHaveBeenCalledTimes(1)
  })

  it('getUserInfoEndpoint', async function () {
    // GIVEN
    mockJson.mockResolvedValue(configuration)

    // WHEN
    expect(await unit.getUserInfoEndpoint())
      .toEqual('/user')

    // THEN
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(configurationEndpoint, { method: 'GET' })
    expect(mockJson).toHaveBeenCalledTimes(1)
  })

  it('getLogoutEndpoint', async function () {
    // GIVEN
    mockJson.mockResolvedValue(configuration)

    // WHEN
    expect(await unit.getLogoutEndpoint())
      .toEqual('/logout')

    // THEN
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(configurationEndpoint, { method: 'GET' })
    expect(mockJson).toHaveBeenCalledTimes(1)
  })

  it('Only fetch once', async function () {
    // GIVEN
    mockJson.mockResolvedValue(configuration)

    // WHEN
    await unit.getAuthEndpoint()
    await unit.getTokenEndpoint()
    await unit.getUserInfoEndpoint()
    await unit.getLogoutEndpoint()

    // THEN
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(configurationEndpoint, { method: 'GET' })
    expect(mockJson).toHaveBeenCalledTimes(1)
  })
})
