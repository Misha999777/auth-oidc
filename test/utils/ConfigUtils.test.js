import { jest, describe, it, expect, beforeEach, beforeAll, afterAll } from '@jest/globals'
import { defaultErrorHandler, populateDefaults } from '../../src/utils/ConfigUtil.js'

beforeAll(() => {
  jest.spyOn(global.console, 'log')
})

beforeEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe('PopulateDefaults', function () {

  it('Empty user config', function () {
    // WHEN -> THEN
    expect(populateDefaults({}))
      .toEqual({
        autoLogin: false,
        errorHandler: defaultErrorHandler,
      })
  })

  it('Full user config', function () {
    // GIVEN
    const testErrorHandler = function () {}
    const config = {
      custom: 'option',
      autoLogin: true,
      errorHandler: testErrorHandler,
    }

    // WHEN -> THEN
    expect(populateDefaults(config))
      .toEqual(config)
  })
})

describe('defaultErrorHandler', function () {

  it('Nominal', function () {
    // WHEN
    defaultErrorHandler('Test Error')

    // THEN
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith('Test Error')
  })
})
