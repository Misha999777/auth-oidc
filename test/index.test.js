import {describe, it, expect} from '@jest/globals';
import {AuthService} from "../src";

describe("Exports", function () {
  it("AuthService exported", function () {
    expect(AuthService).toBeDefined()
  });
});