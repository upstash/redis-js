function parseRecursive(obj: unknown): unknown {
  const parsed = Array.isArray(obj)
    ? obj.map((o) => {
      try {
        return parseRecursive(o);
      } catch {
        return o;
      }
    })
    : JSON.parse(obj as string);

  /**
   * Parsing very large numbers can result in MAX_SAFE_INTEGER
   * overflow. In that case we return the number as string instead.
   */
  if (typeof parsed === "number" && parsed.toString() != obj) {
    return obj;
  }
  return parsed;
}

export function parseResponse<TResult>(result: unknown): TResult {
  try {
    /**
     * Try to parse the response if possible
     */
    return parseRecursive(result) as TResult;
  } catch {
    return result as TResult;
  }
}
