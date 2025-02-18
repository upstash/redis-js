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

/**
 * Merges multiple Records of headers into a single Record
 * Later headers take precedence over earlier ones.
 *
 * @param headers - Array of header records to merge
 * @returns A new Record containing all merged headers
 *
 * @example
 * const defaultHeaders = { 'Content-Type': 'application/json' };
 * const customHeaders = { 'Authorization': 'Bearer token' };
 * const merged = mergeHeaders(defaultHeaders, customHeaders);
 */
export function mergeHeaders(
  ...headers: (Record<string, string> | undefined)[]
): Record<string, string> {
  const merged: Record<string, string> = {};

  for (const header of headers) {
    if (!header) continue;

    for (const [key, value] of Object.entries(header)) {
      if (value !== undefined && value !== null) {
        merged[key] = value;
      }
    }
  }

  return merged;
}
