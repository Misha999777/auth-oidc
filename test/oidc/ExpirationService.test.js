import {jest, describe, it, expect, afterAll, beforeEach, beforeAll} from '@jest/globals';
import {mockWatcherActions} from "../mocks/WatcherActions.mock.js";
import {ExpirationService} from "../../src/oidc/ExpirationService.js";

let unit;

beforeAll(() => {
  global.setInterval = jest.fn();
})

beforeEach(() => {
  unit = new ExpirationService(mockWatcherActions);
  jest.clearAllMocks();
});

afterAll(() => {
  delete global.setInterval;
})

describe("ExpirationService constructor", function() {

  it("nominal", function() {
    //WHEN -> THEN
    expect(unit.actions)
      .toEqual(mockWatcherActions);
  });
});

describe("ExpirationService watchExpiration", function() {

  it("nominal", function() {
    //GIVEN
    unit._checkExpiration = jest.fn();

    //WHEN
    unit.watchExpiration();

    //THEN
    expect(unit._checkExpiration).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(unit._checkExpiration, 5000);
  });
});

describe("ExpirationService _checkExpiration", function() {

  it("nominal", async function() {
    //GIVEN
    mockWatcherActions.checkExpiration.mockReturnValue(true);
    mockWatcherActions.refresh.mockResolvedValue({});

    //WHEN
    await unit._checkExpiration();

    //THEN
    expect(unit.actions.reload).toBeDefined();
    expect(mockWatcherActions.checkExpiration).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.refresh).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.reload).toHaveBeenCalledTimes(1);
  });

  it("not expired", async function() {
    //GIVEN
    mockWatcherActions.checkExpiration.mockReturnValue(false);

    //WHEN
    await unit._checkExpiration();

    //THEN
    expect(unit.actions.reload).toBeUndefined();
    expect(mockWatcherActions.checkExpiration).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.refresh).toHaveBeenCalledTimes(0);
  });

  it("already reloaded", async function() {
    //GIVEN
    mockWatcherActions.checkExpiration.mockReturnValue(true);
    mockWatcherActions.refresh.mockResolvedValue();
    unit.actions.reload = undefined;

    //WHEN
    await unit._checkExpiration();

    //THEN
    expect(mockWatcherActions.checkExpiration).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.refresh).toHaveBeenCalledTimes(1);
  });

  it("failed to fetch", async function() {
    //GIVEN
    mockWatcherActions.checkExpiration.mockReturnValue(true);
    mockWatcherActions.refresh.mockRejectedValue({message: 'Failed to fetch'});

    //WHEN
    await unit._checkExpiration();

    //THEN
    expect(mockWatcherActions.checkExpiration).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.refresh).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.forgetSession).toHaveBeenCalledTimes(0);
  });

  it("unable to refresh", async function() {
    //GIVEN
    mockWatcherActions.checkExpiration.mockReturnValue(true);
    mockWatcherActions.refresh.mockRejectedValue({message: ':)'});

    //WHEN
    await unit._checkExpiration();

    //THEN
    expect(mockWatcherActions.checkExpiration).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.refresh).toHaveBeenCalledTimes(1);
    expect(mockWatcherActions.forgetSession).toHaveBeenCalledTimes(1);
  });
});