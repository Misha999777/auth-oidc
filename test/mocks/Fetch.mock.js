import {jest} from "@jest/globals";

export const mockJson = jest.fn();
export const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: mockJson
});