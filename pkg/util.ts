import { UpstashResponse } from "./types"

function parseRecursive(obj: unknown): unknown {
  return Array.isArray(obj)
    ? obj.map((o) => {
        try {
          return parseRecursive(o)
        } catch {
          return o
        }
      })
    : JSON.parse(obj as string)
}

export function parseResponse<TResult>(res: UpstashResponse<TResult>): TResult {
  try {
    /**
     * Try to parse the response if possible
     */
    return parseRecursive(res.result) as TResult
  } catch {
    return res.result as TResult
  }
}
