import { vi } from 'vitest'

export const mockConfigUtils = {
  populateDefaults: vi.fn(),
  defaultErrorHandler: vi.fn(),
}

vi.mock(import('../../../src/utils/ConfigUtil.js'), () => mockConfigUtils)
