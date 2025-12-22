import { vi, describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { defaultErrorHandler, populateDefaults } from '../../src/utils/ConfigUtil.js'

beforeAll(() => {
  vi.spyOn(global.console, 'log').mockImplementation(() => {})
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  vi.restoreAllMocks()
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
