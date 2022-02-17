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

export function parseResponse<TResult>(result: unknown): TResult {
  try {
    /**
     * Try to parse the response if possible
     */
    return parseRecursive(result) as TResult
  } catch {
    return result as TResult
  }
}
