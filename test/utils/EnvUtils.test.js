import {describe, it, expect, afterEach} from '@jest/globals';
import {isCapacitorNative, isElectron} from "../../src/utils/EnvUtils.js";

afterEach(() => {
  delete global.window
  delete global.navigator
});

describe("isCapacitorNative", function () {

  it("Capacitor defined, native platform", function () {
    global.window = {
      Capacitor: {
        isNativePlatform: true
      }
    };

    expect(isCapacitorNative()).toBe(true)
  });

  it("Capacitor defined, not native platform", function () {
    global.window = {
      Capacitor: {
        isNativePlatform: false
      }
    };

    expect(isCapacitorNative()).toBe(false)
  });

  it("Capacitor undefined", function () {
    global.window = {};

    expect(isCapacitorNative()).toBe(false)
  });
});

describe("isElectron", function () {

  it("UserAgent Electron", function () {
    global.navigator = {
      userAgent: "Electron"
    };

    expect(isElectron()).toBe(true)
  });

  it("UserAgent not Electron", function () {
    global.navigator = {
      userAgent: "123"
    };

    expect(isElectron()).toBe(false)
  });
});