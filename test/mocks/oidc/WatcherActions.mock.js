import { vi } from 'vitest'

export const mockWatcherActions = {
  checkExpiration: vi.fn(),
  reload: vi.fn(),
  refresh: vi.fn(),
  forgetSession: vi.fn(),
}
