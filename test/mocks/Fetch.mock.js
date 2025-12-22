import { vi } from 'vitest'

export const mockJson = vi.fn()

export const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: mockJson,
})
