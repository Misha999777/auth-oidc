import { describe, it, expect } from 'vitest'
import { AuthService } from '../src'

describe('Exports', function () {

  it('AuthService exported', function () {
    // WHEN -> THEN
    expect(AuthService).toBeDefined()
  })
})
