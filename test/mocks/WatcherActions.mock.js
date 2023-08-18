import {jest} from "@jest/globals";

export const mockWatcherActions = {
  checkExpiration: jest.fn(),
  reload: jest.fn(),
  refresh: jest.fn(),
  forgetSession: jest.fn()
}