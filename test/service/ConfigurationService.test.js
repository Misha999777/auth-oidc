import {jest, describe, it, expect, afterEach, beforeEach} from '@jest/globals';
import {ConfigurationService} from "../../src/service/ConfigurationService.js";

describe("ConfigurationService", function() {

  const authorityUrl = "https://server.com/project"
  const configurationEndpoint = authorityUrl + "/.well-known/openid-configuration"

  let unit;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          authorization_endpoint: "/auth",
          token_endpoint: "/token",
          userinfo_endpoint: "/user",
          end_session_endpoint: "/logout"
        })
      })
    );

    unit = new ConfigurationService(authorityUrl);
  });

  afterEach(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(configurationEndpoint, {method: 'GET'})
    delete global.fetch;
  })

  it("getAuthEndpoint", async function() {
    expect(await unit.getAuthEndpoint())
      .toEqual("/auth");
  });

  it("getTokenEndpoint", async function() {
    expect(await unit.getTokenEndpoint())
      .toEqual("/token");
  });

  it("getUserInfoEndpoint", async function() {
    expect(await unit.getUserInfoEndpoint())
      .toEqual("/user");
  });

  it("getLogoutEndpoint", async function() {
    expect(await unit.getLogoutEndpoint())
      .toEqual("/logout");
  });

  it("Only fetch once", async function() {
    await unit.getAuthEndpoint()
    await unit.getTokenEndpoint()
    await unit.getUserInfoEndpoint()
    await unit.getLogoutEndpoint()
  });
});