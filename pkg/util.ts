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
  if (typeof parsed === "number" && parsed.toString() !== obj) {
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

/**
 * Deserializes a scan result, excluding the cursor
 * which can be string "0" or a big number string.
 * Either way, we want it to stay as a string.
 * 
 * @param result 
 */
export function deserializeScanResponse<TResult>(result: [string, ...any]): TResult {
  return [result[0], ...parseResponse<any[]>(result.slice(1))] as TResult;
}