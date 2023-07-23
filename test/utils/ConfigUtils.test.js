import {jest, describe, it, expect, afterEach} from '@jest/globals';
import {defaultErrorHandler, populateDefaults} from "../../src/utils/ConfigUtil.js";

describe("PopulateDefaults", function() {

  it("Empty user config", function() {
    expect(populateDefaults({}))
      .toEqual({
        autoLogin: false,
        errorHandler: defaultErrorHandler,
        electronRedirectUrl: 'http://localhost/',
        capacitorRedirectUrl: 'http://localhost/'
      });
  });

  it("Full user config", function() {
    const testErrorHandler = function() {};
    const config = {
      custom: 'option',
      autoLogin: true,
      errorHandler: testErrorHandler,
      electronRedirectUrl: 'http://some.domain/',
      capacitorRedirectUrl: 'http://another.domain/'
    }

    expect(populateDefaults(config))
      .toEqual(config);
  });
});

describe("defaultErrorHandler", function() {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Nominal", function() {
    jest.spyOn(global.console, 'log')

    defaultErrorHandler('Test Error')

    expect(console.log).toBeCalledTimes(1)
    expect(console.log).toBeCalledWith('Test Error');
  });
});