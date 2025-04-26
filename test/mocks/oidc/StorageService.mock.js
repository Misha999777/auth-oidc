import { jest } from '@jest/globals'

export const mockStorageService = {
  setRedirectUri: jest.fn(),
  getRedirectUri: jest.fn(),
  setAuth: jest.fn(),
  getAccessToken: jest.fn(),
  setUserInfo: jest.fn(),
  getRefreshToken: jest.fn(),
  getUserInfo: jest.fn(),
  getUserClaim: jest.fn(),
  removeAuth: jest.fn(),
  getIdToken: jest.fn(),
  getAuth: jest.fn(),
  removeRedirectUri: jest.fn(),
  getExpiration: jest.fn(),
  setVerifier: jest.fn(),
  getVerifier: jest.fn(),
  removeVerifier: jest.fn(),
}

jest.unstable_mockModule('../../src/oidc/StorageService.js', () => ({
  StorageService: jest.fn().mockImplementation(() => mockStorageService),
}))
