import { jest } from '@jest/globals'

export const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}
